import express from 'express';
import { pool } from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/admin/users
 * Get all users (admin only)
 */
router.get('/users', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        const [users] = await pool.execute(
            `SELECT 
                ID_user as id,
                Nickname as nickname,
                Email as email,
                Teacher as teacher,
                Administrator as admin
            FROM users
            ORDER BY Nickname ASC`
        );

        // Convert boolean fields
        const formattedUsers = users.map(user => ({
            ...user,
            teacher: Boolean(user.teacher),
            admin: Boolean(user.admin)
        }));

        res.json({
            success: true,
            users: formattedUsers
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PATCH /api/admin/users/:id/teacher
 * Toggle teacher status for a user (admin only)
 */
router.patch('/users/:id/teacher', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        const userId = parseInt(req.params.id);
        const { teacher } = req.body;

        if (typeof teacher !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Le champ teacher doit être un booléen'
            });
        }

        // Check if user exists
        const [users] = await pool.execute(
            'SELECT ID_user, Administrator FROM users WHERE ID_user = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        // Don't allow modifying admin users
        if (users[0].Administrator === 1) {
            return res.status(403).json({
                success: false,
                message: 'Impossible de modifier le statut d\'un administrateur'
            });
        }

        // Update teacher status
        await pool.execute(
            'UPDATE users SET Teacher = ? WHERE ID_user = ?',
            [teacher ? 1 : 0, userId]
        );

        res.json({
            success: true,
            message: teacher 
                ? 'Statut professeur accordé' 
                : 'Statut professeur révoqué'
        });
    } catch (error) {
        next(error);
    }
});

export default router;
