import { pool } from '../config/database.js';

/**
 * Get all subjects
 */
export async function getAllSubjects() {
    const [subjects] = await pool.execute(
        'SELECT ID_Subject as id, Subject_name as name FROM Subjectt ORDER BY Subject_name'
    );
    return subjects;
}

/**
 * Get chapters, optionally filtered by subjectId
 */
export async function getChapters(subjectId = null) {
    let query = 'SELECT ID_Chapter as id, Chapter_name as name, ID_Subject as subjectId FROM Chapter';
    const params = [];

    if (subjectId) {
        query += ' WHERE ID_Subject = ?';
        params.push(subjectId);
    }

    query += ' ORDER BY Chapter_name';

    const [chapters] = await pool.execute(query, params);
    return chapters;
}

/**
 * Create a new subject
 */
export async function createSubject(subjectName) {
    // Validation
    if (!subjectName || subjectName.trim() === '') {
        throw new Error('Le nom de la matière est requis');
    }

    // Check if subject already exists
    const [existing] = await pool.execute(
        'SELECT ID_Subject FROM Subjectt WHERE Subject_name = ?',
        [subjectName.trim()]
    );

    if (existing.length > 0) {
        const error = new Error('Cette matière existe déjà');
        error.statusCode = 409;
        throw error;
    }

    // Insert new subject
    const [result] = await pool.execute(
        'INSERT INTO Subjectt (Subject_name) VALUES (?)',
        [subjectName.trim()]
    );

    return result.insertId;
}

/**
 * Create a new chapter
 */
export async function createChapter(chapterName, subjectId) {
    // Validation
    if (!chapterName || chapterName.trim() === '') {
        throw new Error('Le nom du chapitre est requis');
    }

    if (!subjectId) {
        throw new Error('L\'ID de la matière est requis');
    }

    // Verify subject exists
    const [subjectExists] = await pool.execute(
        'SELECT ID_Subject FROM Subjectt WHERE ID_Subject = ?',
        [subjectId]
    );

    if (subjectExists.length === 0) {
        const error = new Error('Matière non trouvée');
        error.statusCode = 404;
        throw error;
    }

    // Check if chapter already exists for this subject
    const [existing] = await pool.execute(
        'SELECT ID_Chapter FROM Chapter WHERE Chapter_name = ? AND ID_Subject = ?',
        [chapterName.trim(), subjectId]
    );

    if (existing.length > 0) {
        const error = new Error('Ce chapitre existe déjà pour cette matière');
        error.statusCode = 409;
        throw error;
    }

    // Insert new chapter
    const [result] = await pool.execute(
        'INSERT INTO Chapter (Chapter_name, ID_Subject) VALUES (?, ?)',
        [chapterName.trim(), subjectId]
    );

    return result.insertId;
}
