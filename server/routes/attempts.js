import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/attempts
 * Get all attempts for the authenticated user
 * Requirements: 5.6
 */
router.get('/attempts', authenticateToken, async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get all attempts for this user with QCM details
        const [attempts] = await pool.execute(
            `SELECT 
                a.ID_Attempt as id,
                a.ID_QCM as qcmId,
                a.Grade as grade,
                a.Date_attempt as date,
                q.Name_QCM as qcmName,
                q.Difficulty as difficulty
            FROM Attempt a
            JOIN QCM q ON a.ID_QCM = q.ID_QCM
            WHERE a.ID_user = ?
            ORDER BY a.Date_attempt DESC`,
            [userId]
        );

        res.json({
            success: true,
            attempts
        });
    } catch (error) {
        next(error);
    }
});

export default router;
