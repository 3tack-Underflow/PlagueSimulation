const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql2');

// information of the database
const db = mysql.createPool({
    host: '23.91.84.211',
    user: 'cs',
    password: 'cs348',
    database: 'user_schema'
});

app.use(cors());
// allow req to be passed as object so we can use req.body
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/api/get-simulation_humans', (req, res) => {
    const simID = req.body.simID;
    const sqlInsert = "SELECT * FROM simulation_humans WHERE id = ?;";
    db.query(sqlInsert, [simID], (err, result) => {
        res.send(result);
    });
});

app.post('/api/get-current_simulation', (req, res) => {
    const simID = req.body.simID;
    const sqlInsert = "SELECT * FROM simulation WHERE id = ?;";
    db.query(sqlInsert, [simID], (err, result) => {
        res.send(result);
    });
});

// req is request, res is response
app.post('/api/insert', (req, res) => {
    const username = req.body.user; 
    const password = req.body.pass;
    // send to the front end
    const sqlInsert = "INSERT INTO user (username, password) VALUES (?,?);";
    db.query(sqlInsert, [username, password], (err, result) => {
        console.log(result);
    });
});

app.listen(3001, () => {
    console.log("running on port 3001");
});