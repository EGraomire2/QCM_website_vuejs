const express = require('express'); 
const app = express(); 
const port = 3000; 
 
app.get('/', (req, res) => { 
    res.send('Hello World!'); 
}); 
 
app.listen(port, () => { 
    console.log(`Server is running at http://localhost:${port}`); 
});       

var cors = require('cors');
var bodyParser = require('body-parser'); 

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json 

const mysql = require('mysql2'); 
const bcrypt = require('bcrypt');
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

// Création de compte utilisateur
app.post('/api/register', (req, res) => { 
    const { username, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const sqlget = 'SELECT * FROM users WHERE username = ?';
    db.query(sqlget, [username], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        if (result.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }
    });

    // Hash password then insert
    bcrypt.hash(password, 10, (hashErr, hash) => {
        if (hashErr) return res.status(500).json({ message: 'Error hashing password' });

        const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(sql, [username, hash], (insertErr, insertRes) => {
            if (insertErr) return res.status(500).json({ message: 'Database error' });
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

// Connexion utilisateur
app.post('/api/login', (req, res) => { 
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        if (result.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result[0];
        bcrypt.compare(password, user.password, (cmpErr, isMatch) => {
            if (cmpErr) return res.status(500).json({ message: 'Error validating password' });
            if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
            res.status(200).json({ message: 'Login successful' });
        });
    });
});