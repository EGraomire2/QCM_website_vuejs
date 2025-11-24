import dotenv from 'dotenv';
dotenv.config();

/**
 * CORS configuration middleware
 * Configures allowed origins based on environment
 */
const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8082',
    process.env.CORS_ORIGIN
].filter(Boolean);

console.log('🌐 [CORS] Origins autorisées:', allowedOrigins);

const corsMiddleware = (req, res, next) => {
    const origin = req.headers.origin;
    
    console.log('🌐 [CORS] Requête depuis:', origin);
    console.log('🌐 [CORS] Méthode:', req.method);
    
    // Set CORS headers for all requests
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    
    console.log('✓ [CORS] Headers définis pour:', origin);
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        console.log('🌐 [CORS] Preflight request - réponse 204');
        return res.status(204).end();
    }
    
    next();
};

export default corsMiddleware;
