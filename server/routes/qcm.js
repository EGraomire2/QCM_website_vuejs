import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, requireTeacher } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/qcm
 * Get QCMs filtered by subject and/or chapter
 */
router.get('/qcm', authenticateToken, async (req, res, next) => {
    try {
        const { subjectId, chapterId } = req.query;

        let query = `
            SELECT 
                q.ID_QCM as id,
                q.Name_QCM as name,
                q.Difficulty as difficulty,
                q.ID_Chapter as chapterId,
                q.ID_user as userId,
                c.ID_Subject as subjectId
            FROM QCM q
            JOIN Chapter c ON q.ID_Chapter = c.ID_Chapter
            WHERE 1=1
        `;
        const params = [];

        if (subjectId) {
            query += ' AND c.ID_Subject = ?';
            params.push(subjectId);
        }

        if (chapterId) {
            query += ' AND q.ID_Chapter = ?';
            params.push(chapterId);
        }

        query += ' ORDER BY q.Name_QCM';

        const [qcms] = await pool.execute(query, params);

        res.json({
            success: true,
            qcms
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/qcm/:id
 * Get a specific QCM with all its questions and propositions
 */
router.get('/qcm/:id', authenticateToken, async (req, res, next) => {
    try {
        const { id } = req.params;

        // Get QCM details
        const [qcmRows] = await pool.execute(
            `SELECT 
                ID_QCM as id,
                Name_QCM as name,
                Difficulty as difficulty,
                ID_Chapter as chapterId,
                ID_user as userId
            FROM QCM
            WHERE ID_QCM = ?`,
            [id]
        );

        if (qcmRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'QCM non trouvé'
            });
        }

        const qcm = qcmRows[0];

        // Get questions for this QCM
        const [questions] = await pool.execute(
            `SELECT 
                ID_Question as id,
                Question_heading as heading,
                Number_of_points as points,
                Type_of_question as type,
                Negative_points as negativePoints,
                Explanation as explanation
            FROM Question
            WHERE ID_QCM = ?
            ORDER BY ID_Question`,
            [id]
        );

        // Get propositions for each question
        for (const question of questions) {
            const [propositions] = await pool.execute(
                `SELECT 
                    ID_Proposition as id,
                    Proposition as proposition,
                    Validity as validity
                FROM Possible_answer
                WHERE ID_Question = ?
                ORDER BY ID_Proposition`,
                [question.id]
            );

            // Convert validity from 0/1 to boolean
            question.answers = propositions.map(p => ({
                ...p,
                validity: Boolean(p.validity)
            }));
        }

        res.json({
            success: true,
            qcm,
            questions
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/qcm/create
 * Create a new QCM with questions and propositions (teacher only)
 * Uses transaction to ensure data integrity
 */
router.post('/qcm/create', authenticateToken, requireTeacher, async (req, res, next) => {
    const connection = await pool.getConnection();
    
    try {
        const { qcmName, qcmSubject, qcmChapter, difficulty, questions } = req.body;
        const userId = req.user.id;

        // Validation
        if (!qcmName || qcmName.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Le nom du QCM est requis'
            });
        }

        if (!qcmChapter) {
            return res.status(400).json({
                success: false,
                message: 'Le chapitre est requis'
            });
        }

        if (!questions || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Au moins une question est requise'
            });
        }

        // Validate difficulty
        if (difficulty === undefined || difficulty < 0 || difficulty > 2) {
            return res.status(400).json({
                success: false,
                message: 'La difficulté doit être 0 (facile), 1 (moyen) ou 2 (difficile)'
            });
        }

        // Verify chapter exists
        const [chapterExists] = await connection.execute(
            'SELECT ID_Chapter FROM Chapter WHERE ID_Chapter = ?',
            [qcmChapter]
        );

        if (chapterExists.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Chapitre non trouvé'
            });
        }

        // Validate each question
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];

            if (!question.question || question.question.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: `La question ${i + 1} est vide`
                });
            }

            if (!question.answers || question.answers.length < 2) {
                return res.status(400).json({
                    success: false,
                    message: `La question ${i + 1} doit avoir au moins 2 réponses`
                });
            }

            // Validate that at least one answer is marked as correct
            const correctCount = question.isCorrect.filter(Boolean).length;
            if (correctCount === 0) {
                return res.status(400).json({
                    success: false,
                    message: `La question ${i + 1} doit avoir au moins une réponse correcte`
                });
            }

            // Validate points
            if (!question.questionPoints || question.questionPoints < 1) {
                return res.status(400).json({
                    success: false,
                    message: `La question ${i + 1} doit avoir au moins 1 point`
                });
            }

            // Validate negative points
            if (question.negativePoints === undefined || question.negativePoints < 0) {
                return res.status(400).json({
                    success: false,
                    message: `Les points négatifs de la question ${i + 1} doivent être >= 0`
                });
            }
        }

        // Begin transaction
        await connection.beginTransaction();

        // Insert QCM
        const [qcmResult] = await connection.execute(
            'INSERT INTO QCM (Name_QCM, Difficulty, ID_user, ID_Chapter) VALUES (?, ?, ?, ?)',
            [qcmName.trim(), difficulty, userId, qcmChapter]
        );
        const qcmId = qcmResult.insertId;

        // Insert questions and propositions
        for (const question of questions) {
            // Determine question type based on number of correct answers
            const correctCount = question.isCorrect.filter(Boolean).length;
            const questionType = correctCount > 1 ? 'multiple' : 'unique';

            // Insert question
            const [questionResult] = await connection.execute(
                `INSERT INTO Question 
                (Question_heading, Number_of_points, Type_of_question, Negative_points, Explanation, ID_QCM) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    question.question.trim(),
                    question.questionPoints,
                    questionType,
                    question.negativePoints,
                    question.explanation || '',
                    qcmId
                ]
            );
            const questionId = questionResult.insertId;

            // Insert propositions
            for (let i = 0; i < question.answers.length; i++) {
                await connection.execute(
                    'INSERT INTO Possible_answer (Proposition, Validity, ID_Question) VALUES (?, ?, ?)',
                    [
                        question.answers[i].trim(),
                        question.isCorrect[i] ? 1 : 0,
                        questionId
                    ]
                );
            }
        }

        // Commit transaction
        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'QCM créé avec succès',
            qcmId
        });

    } catch (error) {
        // Rollback transaction on error
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
});

/**
 * POST /api/qcm/:id/submit
 * Submit answers for a QCM and calculate score
 * Requirements: 5.5, 5.6, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */
router.post('/qcm/:id/submit', authenticateToken, async (req, res, next) => {
    const connection = await pool.getConnection();
    
    try {
        const qcmId = parseInt(req.params.id);
        const userId = req.user.id;
        const { answers } = req.body;

        // Validation
        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                message: 'Les réponses doivent être un tableau'
            });
        }

        // Get QCM details to verify it exists
        const [qcmRows] = await connection.execute(
            'SELECT ID_QCM FROM QCM WHERE ID_QCM = ?',
            [qcmId]
        );

        if (qcmRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'QCM non trouvé'
            });
        }

        // Get all questions for this QCM with their propositions
        const [questions] = await connection.execute(
            `SELECT 
                ID_Question as id,
                Question_heading as heading,
                Number_of_points as points,
                Type_of_question as type,
                Negative_points as negativePoints,
                Explanation as explanation
            FROM Question
            WHERE ID_QCM = ?
            ORDER BY ID_Question`,
            [qcmId]
        );

        if (questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Ce QCM ne contient aucune question'
            });
        }

        // Get propositions for each question
        for (const question of questions) {
            const [propositions] = await connection.execute(
                `SELECT 
                    ID_Proposition as id,
                    Proposition as proposition,
                    Validity as validity
                FROM Possible_answer
                WHERE ID_Question = ?
                ORDER BY ID_Proposition`,
                [question.id]
            );

            question.propositions = propositions.map(p => ({
                ...p,
                validity: Boolean(p.validity)
            }));
        }

        // Organize user answers by question
        const userAnswersByQuestion = {};
        for (const answer of answers) {
            if (!userAnswersByQuestion[answer.questionId]) {
                userAnswersByQuestion[answer.questionId] = [];
            }
            userAnswersByQuestion[answer.questionId].push(answer.propositionId);
        }

        // Import scoring service dynamically
        const { calculateFinalGrade } = await import('../services/scoring.js');

        // Calculate scores
        const { totalPoints, earnedPoints, grade, questionScores } = calculateFinalGrade(
            questions,
            userAnswersByQuestion
        );

        // Begin transaction
        await connection.beginTransaction();

        // Delete previous attempt if exists (Requirement 5.6)
        const [existingAttempts] = await connection.execute(
            'SELECT ID_Attempt FROM Attempt WHERE ID_QCM = ? AND ID_user = ?',
            [qcmId, userId]
        );

        if (existingAttempts.length > 0) {
            const oldAttemptId = existingAttempts[0].ID_Attempt;
            
            // Delete Has_answered records
            await connection.execute(
                `DELETE ha FROM Has_answered ha
                 JOIN Answer_question aq ON ha.ID_Answer = aq.ID_Answer
                 WHERE aq.ID_Attempt = ?`,
                [oldAttemptId]
            );
            
            // Delete Answer_question records
            await connection.execute(
                'DELETE FROM Answer_question WHERE ID_Attempt = ?',
                [oldAttemptId]
            );
            
            // Delete Attempt record
            await connection.execute(
                'DELETE FROM Attempt WHERE ID_Attempt = ?',
                [oldAttemptId]
            );
        }

        // Create new Attempt record (Requirement 5.5)
        const [attemptResult] = await connection.execute(
            'INSERT INTO Attempt (Date_attempt, Grade, ID_QCM, ID_user) VALUES (NOW(), ?, ?, ?)',
            [grade, qcmId, userId]
        );
        const attemptId = attemptResult.insertId;

        // Create Answer_question and Has_answered records for each question
        for (const question of questions) {
            const pointsEarned = questionScores[question.id] || 0;
            
            // Create Answer_question record
            const [answerResult] = await connection.execute(
                'INSERT INTO Answer_question (Points_earned, ID_Question, ID_Attempt) VALUES (?, ?, ?)',
                [pointsEarned, question.id, attemptId]
            );
            const answerId = answerResult.insertId;

            // Create Has_answered records for each selected proposition
            const userAnswers = userAnswersByQuestion[question.id] || [];
            for (const propositionId of userAnswers) {
                await connection.execute(
                    'INSERT INTO Has_answered (ID_Proposition, ID_Answer) VALUES (?, ?)',
                    [propositionId, answerId]
                );
            }
        }

        // Commit transaction
        await connection.commit();

        res.status(200).json({
            success: true,
            message: 'Réponses soumises avec succès',
            attemptId,
            totalPoints,
            earnedPoints,
            grade
        });

    } catch (error) {
        // Rollback transaction on error
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
});

/**
 * GET /api/qcm/:qcmId/correction/:attemptId
 * Get correction details for a specific attempt
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */
router.get('/qcm/:qcmId/correction/:attemptId', authenticateToken, async (req, res, next) => {
    try {
        const qcmId = parseInt(req.params.qcmId);
        const attemptId = parseInt(req.params.attemptId);
        const userId = req.user.id;

        // Verify the attempt belongs to the current user
        const [attemptRows] = await pool.execute(
            `SELECT 
                ID_Attempt as id,
                Date_attempt as date,
                Grade as grade,
                ID_QCM as qcmId,
                ID_user as userId
            FROM Attempt
            WHERE ID_Attempt = ? AND ID_QCM = ?`,
            [attemptId, qcmId]
        );

        if (attemptRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Tentative non trouvée'
            });
        }

        const attempt = attemptRows[0];

        // Verify the attempt belongs to the current user
        if (attempt.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Accès non autorisé à cette tentative'
            });
        }

        // Get QCM details (Requirement 7.1)
        const [qcmRows] = await pool.execute(
            `SELECT 
                ID_QCM as id,
                Name_QCM as name,
                Difficulty as difficulty
            FROM QCM
            WHERE ID_QCM = ?`,
            [qcmId]
        );

        if (qcmRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'QCM non trouvé'
            });
        }

        const qcm = qcmRows[0];

        // Get all questions for this QCM (Requirement 7.1)
        const [questions] = await pool.execute(
            `SELECT 
                ID_Question as id,
                Question_heading as heading,
                Number_of_points as points,
                Type_of_question as type,
                Negative_points as negativePoints,
                Explanation as explanation
            FROM Question
            WHERE ID_QCM = ?
            ORDER BY ID_Question`,
            [qcmId]
        );

        // For each question, get propositions, user answers, and points earned
        const questionsWithDetails = [];

        for (const question of questions) {
            // Get all propositions for this question (Requirement 7.1, 7.2)
            const [propositions] = await pool.execute(
                `SELECT 
                    ID_Proposition as id,
                    Proposition as proposition,
                    Validity as validity
                FROM Possible_answer
                WHERE ID_Question = ?
                ORDER BY ID_Proposition`,
                [question.id]
            );

            // Convert validity from 0/1 to boolean
            const formattedPropositions = propositions.map(p => ({
                ...p,
                validity: Boolean(p.validity)
            }));

            // Get user's answers for this question (Requirement 7.3)
            const [answerRows] = await pool.execute(
                `SELECT 
                    aq.ID_Answer as answerId,
                    aq.Points_earned as pointsEarned
                FROM Answer_question aq
                WHERE aq.ID_Question = ? AND aq.ID_Attempt = ?`,
                [question.id, attemptId]
            );

            let userAnswers = [];
            let pointsEarned = 0;

            if (answerRows.length > 0) {
                const answerId = answerRows[0].answerId;
                pointsEarned = answerRows[0].pointsEarned;

                // Get the proposition IDs that the user selected
                const [selectedPropositions] = await pool.execute(
                    `SELECT ID_Proposition as propositionId
                    FROM Has_answered
                    WHERE ID_Answer = ?`,
                    [answerId]
                );

                userAnswers = selectedPropositions.map(row => row.propositionId);
            }

            // Build the question object with all details (Requirements 7.1, 7.2, 7.3, 7.4, 7.5)
            questionsWithDetails.push({
                id: question.id,
                heading: question.heading,
                explanation: question.explanation || null, // Requirement 7.4
                type: question.type,
                negativePoints: question.negativePoints,
                points: question.points,
                propositions: formattedPropositions, // Requirement 7.2
                userAnswers, // Requirement 7.3
                pointsEarned // Requirement 7.5
            });
        }

        // Return formatted correction data
        res.json({
            success: true,
            qcm: {
                id: qcm.id,
                name: qcm.name,
                difficulty: qcm.difficulty
            },
            attempt: {
                id: attempt.id,
                grade: attempt.grade,
                date: attempt.date
            },
            questions: questionsWithDetails
        });

    } catch (error) {
        next(error);
    }
});

export default router;
