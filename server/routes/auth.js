import express from 'express';
import * as authService from '../services/auth.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/register
 * Register a new user
 */
router.post('/register', async (req, res, next) => {
    try {
        console.log('📝 [REGISTER] Requête reçue');
        console.log('📝 [REGISTER] Body:', JSON.stringify(req.body, null, 2));
        
        const { username, email, password, teacher } = req.body;

        // Validation
        if (!username || !email || !password) {
            console.log('❌ [REGISTER] Validation échouée: champs manquants');
            return res.status(400).json({
                success: false,
                message: 'Tous les champs sont requis'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('❌ [REGISTER] Validation échouée: email invalide');
            return res.status(400).json({
                success: false,
                message: 'Email invalide'
            });
        }

        // Password validation (minimum 6 characters)
        if (password.length < 6) {
            console.log('❌ [REGISTER] Validation échouée: mot de passe trop court');
            return res.status(400).json({
                success: false,
                message: 'Le mot de passe doit contenir au moins 6 caractères'
            });
        }

        console.log('✓ [REGISTER] Validation réussie, appel du service...');
        const result = await authService.registerUser(username, email, password, teacher || false);

        if (!result.success) {
            console.log('❌ [REGISTER] Échec du service:', result.message);
            return res.status(409).json(result);
        }

        console.log('✓ [REGISTER] Inscription réussie, userId:', result.userId);
        res.status(201).json(result);
    } catch (error) {
        console.error('💥 [REGISTER] Erreur:', error);
        next(error);
    }
});

/**
 * POST /api/login
 * Login a user
 */
router.post('/login', async (req, res, next) => {
    try {
        console.log('🔐 [LOGIN] Requête reçue');
        console.log('🔐 [LOGIN] Email:', req.body.email);
        
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            console.log('❌ [LOGIN] Validation échouée: champs manquants');
            return res.status(400).json({
                success: false,
                message: 'Email et mot de passe requis'
            });
        }

        console.log('✓ [LOGIN] Validation réussie, appel du service...');
        const result = await authService.loginUser(email, password);

        if (!result.success) {
            console.log('❌ [LOGIN] Échec:', result.message);
            return res.status(401).json(result);
        }

        console.log('✓ [LOGIN] Connexion réussie, userId:', result.user.id);
        res.json(result);
    } catch (error) {
        console.error('💥 [LOGIN] Erreur:', error);
        next(error);
    }
});

/**
 * GET /api/auth/verify
 * Verify a user's token
 */
router.get('/auth/verify', authenticateToken, async (req, res, next) => {
    try {
        const result = await authService.verifyUserToken(req.user.id, req.token);

        if (!result.success) {
            return res.status(401).json(result);
        }

        res.json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/logout
 * Logout a user
 */
router.post('/logout', authenticateToken, async (req, res, next) => {
    try {
        const result = await authService.logoutUser(req.user.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export default router;
