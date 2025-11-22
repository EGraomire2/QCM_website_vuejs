const express = require('express'); 
const app = express(); 
const port = 3000; 

var cors = require('cors');
var bodyParser = require('body-parser');  
const mysql = require('mysql2'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const secretKey = 'REZMT4K5LMRSTU';

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json 

const db = mysql.createConnection({ 
    host: 'localhost', 
    user: 'root', 
    password: '', 
    database: 'sos_prepa_bdd'
}); 

db.connect((err) => { 
    if (err) throw err; 
    console.log('Connected to database'); 
}); 

// helper validations
function isValidEmail(email) {
	// simple, permissive email regex
	return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPassword(password) {
	return typeof password === 'string' && password.length >= 8;
}

// Création de compte utilisateur
app.post('/api/register', (req, res) => { 
    const { email, password } = req.body;

    // validate input early
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (!isValidPassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // Vérifier si l'utilisateur existe déjà
    const sqlget = 'SELECT * FROM users WHERE Email = ?';
    db.query(sqlget, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        if (result.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        // Hash password then insert
        bcrypt.hash(password, saltRounds, (hashErr, hash) => {
            if (hashErr) return res.status(500).json({ message: 'Error hashing password' });

            const sql = 'INSERT INTO users (Email, password) VALUES (?, ?)';
            db.query(sql, [email, hash], (insertErr, insertRes) => {
                if (insertErr) return res.status(500).json({ message: 'Database error' });
                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    });
});

// Connexion utilisateur
app.post('/api/login', (req, res) => { 
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (!isValidPassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const sql = 'SELECT * FROM users WHERE Email = ?';
    db.query(sql, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        if (result.length === 0) {
            return res.status(401).json({ message: 'No account found with this email' });
        }

        const user = result[0];
        // Utiliser bcrypt.compare de façon asynchrone
        bcrypt.compare(password, user.password, (compErr, isMatch) => {
            if (compErr) {
                console.error(compErr);
                return res.status(500).json({ message: 'Error comparing passwords' });
            }
            if (isMatch) {
                // Générer un token JWT
                const token = generateToken(user.Email || email);
                db.query('UPDATE users SET token = ? WHERE Email = ?', [token, email], (updateErr) => {
                    if (updateErr) {
                        console.error('Error updating token in DB :', updateErr);
                        // continue anyway
                    }
                    // Réponse uniforme : message, token, user non sensible
                    return res.status(200).json({
                        message: 'Login successful',
                        token: token,
                        user: {
                            id: user.id,
                            email: user.Email
                        }
                    });
                });
            } else {
                res.status(401).json({ message: 'Incorrect password' });
            }
        });
    });
});

// Fonction de génération de token JWT
function generateToken(email) {
    const payload = { email }; 
    const options = { expiresIn: '1h' }; // Token expiration time 
    return jwt.sign(payload, secretKey, options); 
}

// Fonction de vérification de token JWT
function verifyToken(token) { 
    try { 
        const decoded = jwt.verify(token, secretKey); 
        return decoded.email; 
    } catch (err) { 
        return null; // Token is invalid or expired 
    } 
}

// Route: authentifier via token
app.get('/api/authenticate', (req, res) => {
	// lire le header Authorization (format attendu: "Bearer <token>")
	const authHeader = req.headers.authorization || req.headers.Authorization;
	if (!authHeader) {
		return res.status(401).json({ message: 'Authorization header required' });
	}
	const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

	// valider le token JWT et extraire l'email
	const email = verifyToken(token);
	if (!email) {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}

	// vérifier en base que l'utilisateur existe et que le token correspond à celui stocké
	const sql = 'SELECT id, Email, token FROM users WHERE Email = ?';
	db.query(sql, [email], (err, result) => {
		if (err) return res.status(500).json({ message: 'Database error' });
		if (result.length === 0) return res.status(401).json({ message: 'User not found' });

		const user = result[0];
		if (!user.token || user.token !== token) {
			return res.status(401).json({ message: 'Token mismatch or revoked' });
		}

		// authentifié : retourner la même structure que /api/login
		return res.status(200).json({
			message: 'Authenticated',
			token: token,
			user: {
				id: user.id,
				email: user.Email
			}
		});
	});
});

// Test du token


app.get('/', (req, res) => { 
    res.send('Hello World!'); 
}); 

app.listen(port, () => { 
    console.log(`Server is running at http://localhost:${port}`); 
});