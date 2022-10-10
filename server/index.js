const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql2');

// information of the database
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'da316123D!',
    database: 'CS348_Database'
});

app.use(cors);
// allow req to be passed as object so we can use req.body
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// req is request, res is response
app.post('/api/insert', (req, res) => {
    const username = req.body.user;
    const password = req.body.pass;
    // send to the front end
    const sqlInsert = "INSERT INTO Users (Username, Password) VALUES (?, ?);"
    db.query(sqlInsert, {username, password}, (err, result) => {
        res.send("hello ZA WORUDO2888888888");
    });
});

app.listen(3001, () => {
    console.log("running on port 3001");
});