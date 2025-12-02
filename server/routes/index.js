import express from 'express';
import authRoutes from './auth.js';
import subjectsRoutes from './subjects.js';
import qcmRoutes from './qcm.js';
import attemptRoutes from './attempts.js';
import adminRoutes from './admin.js';

const router = express.Router();

// Mount routes
router.use('/', authRoutes);
router.use('/', subjectsRoutes);
router.use('/', qcmRoutes);
router.use('/', attemptRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

export default router;
