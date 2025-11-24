import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, requireTeacher } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/subjects
 * Get all subjects
 */
router.get('/subjects', async (req, res, next) => {
    try {
        const [subjects] = await pool.execute(
            'SELECT ID_Subject as id, Subject_name as name FROM Subjectt ORDER BY Subject_name'
        );

        res.json({
            success: true,
            subjects
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/chapters
 * Get chapters, optionally filtered by subjectId
 */
router.get('/chapters', async (req, res, next) => {
    try {
        const { subjectId } = req.query;

        let query = 'SELECT ID_Chapter as id, Chapter_name as name, ID_Subject as subjectId FROM Chapter';
        const params = [];

        if (subjectId) {
            query += ' WHERE ID_Subject = ?';
            params.push(subjectId);
        }

        query += ' ORDER BY Chapter_name';

        const [chapters] = await pool.execute(query, params);

        res.json({
            success: true,
            chapters
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/subjects/create
 * Create a new subject (teacher only)
 */
router.post('/subjects/create', authenticateToken, requireTeacher, async (req, res, next) => {
    try {
        const { subjectName } = req.body;

        // Validation
        if (!subjectName || subjectName.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Le nom de la matière est requis'
            });
        }

        // Check if subject already exists
        const [existing] = await pool.execute(
            'SELECT ID_Subject FROM Subjectt WHERE Subject_name = ?',
            [subjectName.trim()]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Cette matière existe déjà'
            });
        }

        // Insert new subject
        const [result] = await pool.execute(
            'INSERT INTO Subjectt (Subject_name) VALUES (?)',
            [subjectName.trim()]
        );

        res.status(201).json({
            success: true,
            message: 'Matière créée avec succès',
            subjectId: result.insertId
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/chapters/create
 * Create a new chapter (teacher only)
 */
router.post('/chapters/create', authenticateToken, requireTeacher, async (req, res, next) => {
    try {
        const { chapterName, subjectId } = req.body;

        // Validation
        if (!chapterName || chapterName.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Le nom du chapitre est requis'
            });
        }

        if (!subjectId) {
            return res.status(400).json({
                success: false,
                message: 'L\'ID de la matière est requis'
            });
        }

        // Verify subject exists
        const [subjectExists] = await pool.execute(
            'SELECT ID_Subject FROM Subjectt WHERE ID_Subject = ?',
            [subjectId]
        );

        if (subjectExists.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Matière non trouvée'
            });
        }

        // Check if chapter already exists for this subject
        const [existing] = await pool.execute(
            'SELECT ID_Chapter FROM Chapter WHERE Chapter_name = ? AND ID_Subject = ?',
            [chapterName.trim(), subjectId]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Ce chapitre existe déjà pour cette matière'
            });
        }

        // Insert new chapter
        const [result] = await pool.execute(
            'INSERT INTO Chapter (Chapter_name, ID_Subject) VALUES (?, ?)',
            [chapterName.trim(), subjectId]
        );

        res.status(201).json({
            success: true,
            message: 'Chapitre créé avec succès',
            chapterId: result.insertId
        });
    } catch (error) {
        next(error);
    }
});

export default router;
