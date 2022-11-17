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

////////////////////////////////////////////////////////
// Login Queries
////////////////////////////////////////////////////////
app.get('/api/get-login', (req, res) => {
    // send to the front end
    const sqlInsert = "SELECT * FROM user;";
    db.query(sqlInsert, (err, result) => {
        res.send(result);
    });
});

app.post('/api/login', (req, res) => {
    const username = req.body.user; 
    const password = req.body.pass;
    // send to the front endgit 
    const sql = "SELECT IF(EXISTS (SELECT * FROM user WHERE username = '" + username + "' AND password = '" + password + "'), true, false);";
    db.query(sql, [username, password], (err, result) => {
        console.log(result);
        res.send(result);
    });
});

////////////////////////////////////////////////////////
// Register Queries
////////////////////////////////////////////////////////
// req is request, res is response

app.post('/api/insert-user', (req, res) => {
    const username = req.body.user; 
    const password = req.body.pass;
    // send to the front end
    const sql = "INSERT INTO user (username, password) VALUES (?,?);";
    db.query(sql, [username, password], (err, result) => {
        console.log(result);
    });
});

////////////////////////////////////////////////////////
// Archive Queries
////////////////////////////////////////////////////////

app.post('/api/get-sims', (req, res) => {
    const user = req.body.user;
    const sql = "SELECT * FROM simulation as T1, " +
        "(SELECT id FROM simulation_participation WHERE username = ?) " + 
        "as T2 WHERE T1.id = T2.id;";
    db.query(sql, [user], (err, result) => {
        res.send(result);
    });
});


////////////////////////////////////////////////////////
// Simulation Info Queries
////////////////////////////////////////////////////////

app.post('/api/get-sim', (req, res) => {
    const id = req.body.id;
    const sqlInsert = "SELECT * FROM simulation WHERE id = ?;";
    db.query(sqlInsert, [id], (err, result) => {
        res.send(result);
        console.log(result);
    });
});

////////////////////////////////////////////////////////
// Simulation Creation Queries
////////////////////////////////////////////////////////

app.post('/api/insert-sim', (req, res) => {
    const disease_name = req.body.disease_name;
    const creation_time = req.body.creation_time;
    const completion_time = req.body.completion_time;
    const last_modified_time = req.body.last_modified_time;
    const starting_population = req.body.starting_population;
    const isolation_capacity = req.body.isolation_capacity;
    const sim_status = req.body.sim_status;
    const num_deceased = req.body.num_deceased;
    const seed = req.body.seed;
    const funds = req.body.funds;
    const sql = "INSERT INTO simulation " + 
        "(sim_name, creation_time, completion_time, last_modified_time, " + 
        "environment_starting_population, environment_isolation_capacity, " + 
        "status, num_deceased, seed, funds) VALUES (?,?,?,?,?,?,?,?,?,?); " + 
        "SELECT LAST_INSERT_ID();";
    db.query(sql, 
        [disease_name, creation_time, completion_time, 
            last_modified_time, starting_population, isolation_capacity, 
            sim_status, num_deceased, seed, funds], (err, result) => {
        res.send(result);
    });
});

app.post('/api/insert-sim-participation', (req, res) => {
    const username = req.body.username;
    const id = req.body.id;
    const owner = req.body.owner;
    const sql = "INSERT INTO simulation_participation " + 
        "(username, id, is_owner) VALUES (?,?,?); " + 
        "SELECT LAST_INSERT_ID();";
    db.query(sql, [username, id, owner], (err, result) => {
        res.send(result);
    });
});

app.post('/api/insert-sim-human', async (req, res) => {
    const values = req.body.values;
    const sql = "INSERT INTO simulation_humans " +
        "(num, id, status, isolated, age, weight, height, " + 
        "blood_sugar, blood_pressure, cholesterol, radiation, " + 
        "x, y, tax, mark, name, gender) " + 
        "VALUES ?;";
    db.query(sql, [values], (err, result) => {
        console.log(err)
    }); 
});

////////////////////////////////////////////////////////
// Simulation Queries
////////////////////////////////////////////////////////

app.post('/api/get-simulation_humans', (req, res) => {
    const simID = req.body.simID;
    const sql = "SELECT * FROM simulation_humans WHERE id = ?;";
    db.query(sql, [simID], (err, result) => {
        res.send(result);
    });
});

app.post('/api/get-current_simulation', (req, res) => {
    const simID = req.body.simID;
    const sql = "SELECT * FROM simulation WHERE id = ?;";
    db.query(sql, [simID], (err, result) => {
        res.send(result);
    });
});

app.post('/api/isolate', (req, res) => {
    const isolationCost = req.body.cost; 
    const simID = req.body.simID; 
    const humanID = req.body.humanID; 

    const sql = 
    "START TRANSACTION; " + 

    "UPDATE simulation " + 
    "SET funds = funds - " + isolationCost + 
    ", environment_isolation_capacity = environment_isolation_capacity - 1 " +
    "WHERE id = " + simID + "; " + 
    
    "SELECT @human:=num " +
    "FROM simulation_humans " + 
    "WHERE num = " + humanID + " AND id = " + simID + " AND " + 
    "isolated = 0 AND status = 'alive'; " + 
    
    "CALL `user_schema`.`checkRollback`(@human); " + 
    
    "UPDATE simulation_humans " +
    "SET isolated = 1 " + 
    "WHERE num = " + humanID + " AND id = " + simID + "; " + 
    
    "COMMIT;";
    db.query(sql);
});

app.post('/api/unisolate', (req, res) => {
    const simID = req.body.simID; 
    const humanID = req.body.humanID; 

    const sql = 
    "START TRANSACTION; " + 

    "UPDATE simulation " + 
    "SET environment_isolation_capacity = environment_isolation_capacity + 1 " + 
    "WHERE id = " + simID + "; " + 
    
    "SELECT @human:=num " +
    "FROM simulation_humans " + 
    "WHERE num = " + humanID + " AND id = " + simID + " AND " + 
    "isolated = 1 AND status = 'alive'; " + 
    
    "CALL `user_schema`.`checkRollback`(@human); " + 
    
    "UPDATE simulation_humans " +
    "SET isolated = 0 " + 
    "WHERE num = " + humanID + " AND id = " + simID + "; " + 
    
    "COMMIT;";
    db.query(sql);
});

app.listen(3001, () => {
    console.log("running on port 3001");
});