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
    database: 'user_schema',
    multipleStatements: true
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

////////////////////////////////////////////////////////
// Archive Queries
////////////////////////////////////////////////////////

app.post('/api/insert', (req, res) => {
    const username = req.body.user; 
    const password = req.body.pass;
    
    const sqlInsert = "INSERT INTO user (username, password) VALUES (?,?);";
    db.query(sqlInsert, [username, password], (err, result) => {
        console.log(result);
    });
});

////////////////////////////////////////////////////////
// Simulation Queries
////////////////////////////////////////////////////////
app.post('/api/isolate', (req, res) => {
    const isolationCost = req.body.cost; 
    const simID = req.body.simID; 
    const humanID = req.body.humanID; 

    const sqlInsert = 
    "START TRANSACTION;" + 

    "UPDATE 'simulation'" + 
    "SET funds = funds - " + isolationCost + ", environment_isolation_capacity = environment_isolation_capacity - 1" +
    "WHERE id = " + simID + ";" + 
    
    "SELECT @human = num" +
    "FROM simulation_humans" + 
    "WHERE num = " + humanID + " AND id = " + simID + " AND" + 
    "isolated = 0 AND status = 'alive';" + 
    
    "CALL `user_schema`.`checkRollback`(@human);" + 
    
    "UPDATE simulation_humans" +
    "SET isolated = 1" + 
    "AND num = " + humanID + " AND id = " + simID + ";" + 
    
    "COMMIT";
    db.query(sqlInsert, (err, result) => {
        console.log(result);
    });
});

/*
START TRANSACTION;

UPDATE 'simulation'
SET funds = funds - (isolation cost),
    environment_isolation_capacity = environment_isolation_capacity - 1
WHERE id = (simulation id);

SELECT @human = num
FROM simulation_humans
WHERE num = (human num) AND id = (simulation id) AND
isolated = 0 AND status = 'alive';

CALL `user_schema`.`checkRollback`(@human);

UPDATE simulation_humans
SET isolated = 1
AND num = (human num) AND id = (simulation id);

COMMIT;
*/

app.listen(3001, () => {
    console.log("running on port 3001");
});