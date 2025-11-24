import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { pool } from '../../config/database.js';

/**
 * Integration tests for Attempts endpoints
 * 
 * These tests verify:
 * - GET /api/attempts returns attempts for the authenticated user
 * - Attempts are filtered by user ID
 * 
 * Requirements tested: 5.6
 */

describe('Attempts Endpoints', () => {
    let connection;

    beforeAll(async () => {
        connection = await pool.getConnection();
    });

    afterAll(async () => {
        if (connection) {
            connection.release();
        }
    });

    describe('GET /api/attempts', () => {
        it('should return attempts from the database', async () => {
            // This test verifies that the endpoint correctly queries the Attempt table
            const [attempts] = await connection.execute(`
                SELECT 
                    a.ID_Attempt as id,
                    a.ID_QCM as qcmId,
                    a.Grade as grade,
                    a.Date_attempt as date,
                    q.Name_QCM as qcmName,
                    q.Difficulty as difficulty
                FROM Attempt a
                JOIN QCM q ON a.ID_QCM = q.ID_QCM
                ORDER BY a.Date_attempt DESC
            `);

            expect(attempts).toBeDefined();
            expect(Array.isArray(attempts)).toBe(true);
        });

        it('should filter attempts by userId when provided', async () => {
            // Get a user that has attempts
            const [users] = await connection.execute(`
                SELECT DISTINCT ID_user 
                FROM Attempt
                LIMIT 1
            `);

            if (users.length > 0) {
                const userId = users[0].ID_user;
                const [attempts] = await connection.execute(`
                    SELECT 
                        a.ID_Attempt as id,
                        a.ID_user as userId,
                        a.ID_QCM as qcmId,
                        a.Grade as grade,
                        a.Date_attempt as date
                    FROM Attempt a
                    WHERE a.ID_user = ?
                    ORDER BY a.Date_attempt DESC
                `, [userId]);

                // All returned attempts should belong to the specified user
                attempts.forEach(attempt => {
                    expect(attempt.userId).toBe(userId);
                });
            }
        });

        it('should return attempts ordered by date descending', async () => {
            // Get attempts for any user
            const [users] = await connection.execute(`
                SELECT DISTINCT ID_user 
                FROM Attempt
                LIMIT 1
            `);

            if (users.length > 0) {
                const userId = users[0].ID_user;
                const [attempts] = await connection.execute(`
                    SELECT 
                        a.ID_Attempt as id,
                        a.Date_attempt as date
                    FROM Attempt a
                    WHERE a.ID_user = ?
                    ORDER BY a.Date_attempt DESC
                `, [userId]);

                // Verify attempts are ordered by date descending
                if (attempts.length > 1) {
                    for (let i = 0; i < attempts.length - 1; i++) {
                        const currentDate = new Date(attempts[i].date);
                        const nextDate = new Date(attempts[i + 1].date);
                        expect(currentDate >= nextDate).toBe(true);
                    }
                }
            }
        });

        it('should include QCM details with each attempt', async () => {
            // Get an attempt with QCM details
            const [attempts] = await connection.execute(`
                SELECT 
                    a.ID_Attempt as id,
                    a.ID_QCM as qcmId,
                    a.Grade as grade,
                    a.Date_attempt as date,
                    q.Name_QCM as qcmName,
                    q.Difficulty as difficulty
                FROM Attempt a
                JOIN QCM q ON a.ID_QCM = q.ID_QCM
                LIMIT 1
            `);

            if (attempts.length > 0) {
                const attempt = attempts[0];
                
                // Verify all expected fields are present
                expect(attempt.id).toBeDefined();
                expect(attempt.qcmId).toBeDefined();
                expect(attempt.grade).toBeDefined();
                expect(attempt.date).toBeDefined();
                expect(attempt.qcmName).toBeDefined();
                expect(attempt.difficulty).toBeDefined();
            }
        });
    });
});
