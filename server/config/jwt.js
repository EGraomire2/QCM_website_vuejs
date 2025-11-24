import dotenv from 'dotenv';
dotenv.config();

export default {
    secret: process.env.JWT_SECRET || 'REZMT4K5LMRSTU',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
};
