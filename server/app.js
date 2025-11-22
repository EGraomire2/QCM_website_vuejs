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
const db = mysql.createConnection({ 
    host: 'localhost', 
    user: 'root', 
    password: '', 
    database: 'project_qcm' 
}); 

db.connect((err) => { 
    if (err) throw err; 
    console.log('Connected to database'); 
}); 