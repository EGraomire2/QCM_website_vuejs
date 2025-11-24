import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
import jwtConfig from '../config/jwt.js';

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} - True if password matches
 */
const verifyPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

/**
 * Generate a JWT token for a user
 * @param {object} user - User object with id, email, and teacher fields
 * @returns {string} - JWT token
 */
const generateToken = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        teacher: user.teacher
    };
    return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

/**
 * Register a new user
 * @param {string} nickname - User's nickname
 * @param {string} email - User's email
 * @param {string} password - User's password (plain text)
 * @param {boolean} teacher - Whether user is a teacher (default: false)
 * @returns {Promise<object>} - Result object with success status
 */
const registerUser = async (nickname, email, password, teacher = false) => {
    try {
        console.log('🔧 [SERVICE] registerUser appelé');
        console.log('🔧 [SERVICE] Paramètres:', { nickname, email, teacher });
        
        // Check if email already exists
        console.log('🔧 [SERVICE] Vérification de l\'email existant...');
        const [existingUsers] = await pool.execute(
            'SELECT ID_user FROM users WHERE Email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            console.log('⚠️ [SERVICE] Email déjà existant');
            return {
                success: false,
                message: 'Un compte avec cet email existe déjà'
            };
        }

        // Hash the password
        console.log('🔧 [SERVICE] Hashing du mot de passe...');
        const hashedPassword = await hashPassword(password);
        console.log('✓ [SERVICE] Mot de passe hashé');

        // Insert new user
        console.log('🔧 [SERVICE] Insertion dans la base de données...');
        const [result] = await pool.execute(
            'INSERT INTO users (Nickname, Email, Password, Teacher, Administrator) VALUES (?, ?, ?, ?, ?)',
            [nickname, email, hashedPassword, teacher ? 1 : 0, 0]
        );

        console.log('✓ [SERVICE] Utilisateur créé, ID:', result.insertId);
        return {
            success: true,
            message: 'Utilisateur créé avec succès',
            userId: result.insertId
        };
    } catch (error) {
        console.error('💥 [SERVICE] Error in registerUser:', error);
        console.error('💥 [SERVICE] Error code:', error.code);
        console.error('💥 [SERVICE] Error message:', error.message);
        throw error;
    }
};

/**
 * Login a user
 * @param {string} email - User's email
 * @param {string} password - User's password (plain text)
 * @returns {Promise<object>} - Result object with token and user info
 */
const loginUser = async (email, password) => {
    try {
        console.log('🔧 [SERVICE] loginUser appelé');
        console.log('🔧 [SERVICE] Email:', email);
        
        // Find user by email
        console.log('🔧 [SERVICE] Recherche de l\'utilisateur...');
        const [users] = await pool.execute(
            'SELECT ID_user, Nickname, Email, Password, Teacher FROM users WHERE Email = ?',
            [email]
        );

        if (users.length === 0) {
            console.log('⚠️ [SERVICE] Utilisateur non trouvé');
            return {
                success: false,
                message: 'Email ou mot de passe incorrect'
            };
        }

        const user = users[0];
        console.log('✓ [SERVICE] Utilisateur trouvé, ID:', user.ID_user);

        // Verify password
        console.log('🔧 [SERVICE] Vérification du mot de passe...');
        const isPasswordValid = await verifyPassword(password, user.Password);

        if (!isPasswordValid) {
            console.log('❌ [SERVICE] Mot de passe invalide');
            return {
                success: false,
                message: 'Email ou mot de passe incorrect'
            };
        }

        console.log('✓ [SERVICE] Mot de passe valide');

        // Generate JWT token
        console.log('🔧 [SERVICE] Génération du token JWT...');
        const token = generateToken({
            id: user.ID_user,
            email: user.Email,
            teacher: user.Teacher === 1
        });

        // Store token in database
        console.log('🔧 [SERVICE] Stockage du token dans la BDD...');
        await pool.execute(
            'UPDATE users SET Token = ? WHERE ID_user = ?',
            [token, user.ID_user]
        );

        console.log('✓ [SERVICE] Connexion réussie');
        return {
            success: true,
            token,
            user: {
                id: user.ID_user,
                email: user.Email,
                nickname: user.Nickname,
                teacher: user.Teacher === 1
            }
        };
    } catch (error) {
        console.error('💥 [SERVICE] Error in loginUser:', error);
        console.error('💥 [SERVICE] Error code:', error.code);
        console.error('💥 [SERVICE] Error message:', error.message);
        throw error;
    }
};

/**
 * Verify a user's token
 * @param {number} userId - User's ID
 * @param {string} token - JWT token
 * @returns {Promise<object>} - Result object with user info
 */
const verifyUserToken = async (userId, token) => {
    try {
        // Get user from database
        const [users] = await pool.execute(
            'SELECT ID_user, Nickname, Email, Teacher, Token FROM users WHERE ID_user = ?',
            [userId]
        );

        if (users.length === 0) {
            return {
                success: false,
                message: 'Utilisateur non trouvé'
            };
        }

        const user = users[0];

        // Check if token matches stored token
        if (user.Token !== token) {
            return {
                success: false,
                message: 'Token invalide'
            };
        }

        return {
            success: true,
            user: {
                id: user.ID_user,
                email: user.Email,
                nickname: user.Nickname,
                teacher: user.Teacher === 1
            }
        };
    } catch (error) {
        console.error('Error in verifyUserToken:', error);
        throw error;
    }
};

/**
 * Logout a user (clear token)
 * @param {number} userId - User's ID
 * @returns {Promise<object>} - Result object
 */
const logoutUser = async (userId) => {
    try {
        await pool.execute(
            'UPDATE users SET Token = NULL WHERE ID_user = ?',
            [userId]
        );

        return {
            success: true,
            message: 'Déconnexion réussie'
        };
    } catch (error) {
        console.error('Error in logoutUser:', error);
        throw error;
    }
};

export {
    hashPassword,
    verifyPassword,
    generateToken,
    registerUser,
    loginUser,
    verifyUserToken,
    logoutUser
};
