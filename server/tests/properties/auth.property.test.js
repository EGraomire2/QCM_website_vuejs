import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { hashPassword, verifyPassword, generateToken } from '../../services/auth.js';
import jwt from 'jsonwebtoken';
import jwtConfig from '../../config/jwt.js';

describe('Authentication Property-Based Tests', () => {
    /**
     * **Feature: php-to-vue-nodejs-migration, Property 1: Password hashing on registration**
     * **Validates: Requirements 1.1, 11.1**
     * 
     * For any valid registration credentials, the system should store the password 
     * as a bcrypt hash (not plaintext) in the database
     */
    it('Property 1: Password hashing produces non-plaintext bcrypt hashes', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.string({ minLength: 6, maxLength: 100 }),
                async (password) => {
                    const hash = await hashPassword(password);
                    
                    // Hash should not equal plaintext password
                    expect(hash).not.toBe(password);
                    
                    // Hash should be a bcrypt hash (starts with $2a$, $2b$, or $2y$)
                    expect(hash).toMatch(/^\$2[aby]\$/);
                    
                    // Hash should be verifiable
                    const isValid = await verifyPassword(password, hash);
                    expect(isValid).toBe(true);
                    
                    // Wrong password should not verify
                    if (password !== 'wrongpassword') {
                        const isInvalid = await verifyPassword('wrongpassword', hash);
                        expect(isInvalid).toBe(false);
                    }
                }
            ),
            { numRuns: 100 }
        );
    });

    /**
     * **Feature: php-to-vue-nodejs-migration, Property 2: JWT token generation on login**
     * **Validates: Requirements 1.2, 11.2**
     * 
     * For any valid login credentials, the system should return a valid JWT token 
     * that can be decoded to extract user information
     */
    it('Property 2: JWT tokens contain required user information', () => {
        fc.assert(
            fc.property(
                fc.record({
                    id: fc.integer({ min: 1, max: 1000000 }),
                    email: fc.emailAddress(),
                    teacher: fc.boolean()
                }),
                (user) => {
                    const token = generateToken(user);
                    
                    // Token should be a non-empty string
                    expect(token).toBeTruthy();
                    expect(typeof token).toBe('string');
                    
                    // Token should have three parts (header.payload.signature)
                    const parts = token.split('.');
                    expect(parts.length).toBe(3);
                    
                    // Token should be verifiable with the secret
                    const decoded = jwt.verify(token, jwtConfig.secret);
                    
                    // Decoded token should contain user information
                    expect(decoded.id).toBe(user.id);
                    expect(decoded.email).toBe(user.email);
                    expect(decoded.teacher).toBe(user.teacher);
                    
                    // Token should have an expiration time
                    expect(decoded.exp).toBeDefined();
                    expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
                }
            ),
            { numRuns: 100 }
        );
    });
});
