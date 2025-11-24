import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';

/**
 * JWT authentication middleware
 * Verifies JWT token and attaches user info to request
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Authorization header required'
        });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        req.user = decoded;
        req.token = token;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expiré'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Token invalide'
        });
    }
};

/**
 * Middleware to require teacher role
 */
const requireTeacher = (req, res, next) => {
    if (!req.user || !req.user.teacher) {
        return res.status(403).json({
            success: false,
            message: 'Accès réservé aux professeurs'
        });
    }
    next();
};

export {
    authenticateToken,
    requireTeacher
};
