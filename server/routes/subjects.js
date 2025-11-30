import express from 'express';
import { authenticateToken, requireTeacher } from '../middleware/auth.js';
import * as subjectsService from '../services/subjects.js';

const router = express.Router();

/**
 * GET /api/subjects
 * Get all subjects
 */
router.get('/subjects', async (req, res, next) => {
    try {
        const subjects = await subjectsService.getAllSubjects();

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
        const chapters = await subjectsService.getChapters(subjectId);

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
        const subjectId = await subjectsService.createSubject(subjectName);

        res.status(201).json({
            success: true,
            message: 'Matière créée avec succès',
            subjectId
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }
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
        const chapterId = await subjectsService.createChapter(chapterName, subjectId);

        res.status(201).json({
            success: true,
            message: 'Chapitre créé avec succès',
            chapterId
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
});

export default router;
