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
    // send to the front end
    const sql = "SELECT IF(EXISTS (SELECT * FROM user WHERE username = ? AND password = ?), true, false);";
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
        res.send(result);
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
    const update = req.body.update;
    const factoryX = req.body.factoryX;
    const factoryY = req.body.factoryY;
    const sql = "INSERT INTO simulation " + 
        "(sim_name, creation_time, completion_time, last_modified_time, " + 
        "environment_starting_population, environment_isolation_capacity, " + 
        "status, num_deceased, seed, funds, last_background_update_time, factoryX, factoryY) " + 
        "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?); " + 
        "SELECT LAST_INSERT_ID();";
    db.query(sql, 
        [disease_name, creation_time, completion_time, 
            last_modified_time, starting_population, isolation_capacity, 
            sim_status, num_deceased, seed, funds, update, factoryX, factoryY], (err, result) => {
        res.send(result);
    });
});

app.post('/api/delete-sim', (req, res) => {
    const simID = req.body.simID;
    const sql = "DELETE FROM simulation WHERE id = ?";
    db.query(sql, [simID], (err, result) => {
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

app.post('/api/insert-sim-human', (req, res) => {
    const values = req.body.values;
    const sql = "INSERT INTO simulation_humans " +
        "(num, id, status, isolated, age, weight, height, " + 
        "blood_type, blood_pressure, cholesterol, radiation, " + 
        "x, y, tax, mark, name, gender) " + 
        "VALUES ?;";
    db.query(sql, [values], (err, result) => {
        res.send(result);
        // console.log(err); 
    }); 
});

app.post('/api/insert-plague', (req, res) => {
    const arg1 = req.body.variant;
    const arg2 = req.body.id;
    const arg3 = req.body.strength;
    const arg4 = req.body.spread_chance;
    const arg5 = req.body.spread_radius;
    const arg6 = req.body.spread_cooldown;
    const arg7 = req.body.mutation_chance;
    const arg8 = req.body.curing_threshhold;
    const arg9 = req.body.fatality_threshhold;
    const arg10 = req.body.death_rate;
    const arg11 = req.body.death_cooldown;
    const sql = "INSERT INTO plague " +
        "(variant, id, strength, spread_chance, spread_radius, spread_cooldown, mutation_chance, " + 
        "curing_threshhold, fatality_threshhold, death_rate, death_cooldown) " + 
        "VALUES (?,?,?,?,?,?,?,?,?,?,?);";
    db.query(sql, [arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11], (err, result) => {
        res.send(result);
        // console.log(err);
    }); 
});

app.post('/api/insert-plague-rule', (req, res) => {
    const args = req.body.values;
    const sql = "INSERT INTO plague_rules " +
        "(variant, id, category, range_lower, range_upper, match_value, miss_value) " + 
        "VALUES ?;";
    db.query(sql, [args], (err, result) => {
        res.send(result);
        console.log(err);
    }); 
});

app.post('/api/infest', (req, res) => {
    const args = req.body.infestValues;
    const sql = "INSERT INTO infection " +
        "(human, human_id, plague, plague_id, known, infection_time, cycles_to_die) VALUES ?;";
    db.query(sql, [args], (err, result) => {
        res.send(result);
    });
});

////////////////////////////////////////////////////////
// Simulation Info
////////////////////////////////////////////////////////

app.post('/api/get-alive', (req, res) => {
    const simID = req.body.simID;
    const sql = "SELECT COUNT(*) AS totalAlive FROM simulation_humans " + 
        "WHERE id = ? AND status = 'alive';";
    db.query(sql, [simID], (err, result) => {
        res.send(result);
    });
});

app.post('/api/get-isolated', (req, res) => {
    const simID = req.body.simID;
    const sql = "SELECT COUNT(*) AS totalIsolated FROM simulation_humans " + 
        "WHERE id = ? AND isolated = 1;";
    db.query(sql, [simID], (err, result) => {
        res.send(result);
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

app.post('/api/get-infected', (req, res) => {
    const simID = req.body.simID;
    const sql = "SELECT * FROM infection WHERE plague_id = ?;";
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

app.post('/api/mark-human', (req, res) => {
    const num = req.body.num;
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
    "SET funds = funds - ?"
    ", environment_isolation_capacity = environment_isolation_capacity - 1 " +
    "WHERE id = ?; " + 

    "SELECT @human:=NULL;" +
    
    "SELECT @human:=num " +
    "FROM simulation_humans " + 
    "WHERE num = ? AND id = ? AND " + 
    "isolated = 0 AND status = 'alive'; " + 
    
    "UPDATE simulation_humans " +
    "SET isolated = 1 " + 
    "WHERE num = ? AND id = ? AND " + 
    "isolated = 0 AND status = 'alive'; " + 
    
    "CALL `user_schema`.`checkRollback`(@human);"
    db.query(sql, [0, simID, humanID, simID, humanID, simID], (err, result) => {
        res.send(err);
    });
});

app.post('/api/test', (req, res) => {
    const simID = req.body.simID;
    const humanID = req.body.humanID;
    const cost = req.body.cost;

    const sql = "START TRANSACTION; " +
        "UPDATE simulation " +
        "SET funds = funds - ? " +
        "WHERE id = ?; " +
        "SELECT @human:=NULL; " +
        "SELECT @human:=num " +
        "FROM simulation_humans " +
        "WHERE num = ? AND id = ? " +
        "AND status = 'alive'; " +
        "SELECT IF(EXISTS (SELECT * FROM infection " +
        "WHERE human = ? AND human_id = ?), 'positive', 'negative'); " +
        "UPDATE infection " +
        "SET known = 1 " +
        "WHERE human = ? AND human_id = ?; " +
        "CALL `user_schema`.`checkRollback`(@human);"
    db.query(sql, [cost, simID, humanID, simID, humanID, simID, humanID, simID], (err, result) => {
        res.send(result);
    });
});

app.post('/api/unisolate', (req, res) => {
    const simID = req.body.simID; 
    const humanID = req.body.humanID; 

    const sql = 
        "START TRANSACTION; " + 

        "UPDATE simulation " + 
        "SET environment_isolation_capacity = environment_isolation_capacity + 1 " + 
        "WHERE id = ?; " + 

        "SELECT @human:=NULL;" +
        
        "SELECT @human:=num " +
        "FROM simulation_humans " + 
        "WHERE num = ? AND id = ? AND " + 
        "isolated = 1 AND status = 'alive'; " + 
        
        "UPDATE simulation_humans " +
        "SET isolated = 0 " + 
        "WHERE num = ? AND id = ? AND " + 
        "isolated = 1 AND status = 'alive'; " +
        
        "CALL `user_schema`.`checkRollback`(@human);"
    db.query(sql, [simID, humanID, simID, humanID, simID], (err, result) => {
        res.send(err);
    });
});

app.post('/api/sanitize', (req, res) => {
    const sanitizeCost = req.body.cost; 
    const simID = req.body.simID; 
    const humanID = req.body.humanID; 

    const sql = 
    "START TRANSACTION; " + 

    "UPDATE simulation " +
    "SET funds = funds - ? " +
    "WHERE id = ?;" +

    "UPDATE simulation " +
    "SET environment_isolation_capacity = environment_isolation_capacity + 1 " +
    "WHERE (SELECT status, isolated FROM simulation_humans WHERE num = ? AND id = ? ) = ('dead', 1) " +
    "AND id = ?;" +

    "SELECT @human:=NULL;" +
    
    "SELECT @human:=num " +
    "FROM simulation_humans " + 
    "WHERE num = ? AND id = ? AND " + 
    "status = 'dead'; " + 
    
    "DELETE FROM simulation_humans " +
    "WHERE num = ? AND id = ? " +
    "AND status = 'dead'; " +
    
    "CALL `user_schema`.`checkRollback`(@human);"
    db.query(sql, [sanitizeCost, simID, humanID, simID, simID, humanID, simID, humanID, simID], (err, result) => {
        res.send(err);
    });
});

app.post('/api/collect-tax', (req, res) => {
    const id = req.body.id; 

    const sql = 
    "UPDATE simulation " +
    "SET funds = funds + (SELECT SUM(tax) FROM simulation_humans WHERE id = ? AND status = 'alive' AND isolated = 0) " +
    "WHERE id = ?;"

    db.query(sql, [id, id], (err, result) => {
        res.send(err);
    });
});

app.post('/api/mark', (req, res) => {
    const simID = req.body.simID; 
    const humanID = req.body.humanID; 
    const mark = req.body.mark;

    const sql = 
    "UPDATE simulation_humans " +
    "SET mark = ? WHERE id = ? AND num = ?;"

    db.query(sql, [mark, simID, humanID], (err, result) => {
        res.send(err);
    });
});


app.post('/api/prototype-vaccine', (req, res) => {
    const id = req.body.id;
    const vaccineName = req.body.vaccineName;
    const sql = "INSERT INTO vaccine (id, name) VALUES (?, ?);" + 
                "SELECT LAST_INSERT_ID()";
    db.query(sql, [id, vaccineName], (err, result) => {
        res.send(result);
    });
});

app.post('/api/add-vaccine-rule', (req, res) => {
    const vaccine = req.body.vaccine;
    const id = req.body.id;
    const category = req.body.category;
    const range_lower = req.body.range_lower;
    const range_upper = req.body.range_upper;
    const sql = "INSERT INTO vaccine_rules " +
        "(vaccine, id, category, range_lower, range_upper) " + 
        "VALUES (?,?,?,?,?);";
    db.query(sql, [vaccine, id, category, range_lower, range_upper], (err, result) => {
        res.send(result);
    });
});

app.post('/api/get-vaccine', (req, res) => {
    const id = req.body.id;
    const sql = "SELECT * FROM vaccine WHERE id = ?;";
    db.query(sql, [id], (err, result) => {
        res.send(result);
    });
});

app.post('/api/get-vaccine-rules', (req, res) => {
    const id = req.body.id;
    const vaccine = req.body.vaccine;
    const sql = "SELECT * FROM vaccine_rules WHERE id = ? AND vaccine = ?";
    db.query(sql, [id, vaccine], (err, result) => {
        res.send(result);
    });
});

app.post('/api/delete-vaccine', (req, res) => {
    const id = req.body.vaccine;
    const sql = "DELETE FROM vaccine WHERE num = ?; " + 
        "DELETE FROM vaccine_rules WHERE vaccine = ?;";
    db.query(sql, [id, id], (err, result) => {
        res.send(result);
    });
});

app.post('/api/find-mutate', (req, res) => {
    const id = req.body.id;
    const sql = "SELECT plague FROM infection WHERE plague_id = ? GROUP BY plague HAVING COUNT(*) = (SELECT MAX(count) FROM (SELECT plague, COUNT(*) as count FROM infection WHERE plague_id = ? GROUP BY plague) as T);"
    db.query(sql, [id, id], (err, result) => {
        res.send(result);
    });
});

// req is request, res is response
app.post('/api/get-sim', (req, res) => {
    const id = req.body.id;
    // send to the front end
    const sqlInsert = "SELECT * FROM simulation WHERE id = (?);";
    db.query(sqlInsert, [id], (err, result) => {
        res.send(result);
    });
});

app.post('/api/get-all-sims', (req, res) => {
    // send to the front end
    const sqlInsert = "SELECT * FROM simulation;";
    db.query(sqlInsert, (err, result) => {
        res.send(result);
    });
});

app.post('/api/get-all-users', (req, res) => {
    // send to the front end
    const sqlInsert = "SELECT * FROM user;";
    db.query(sqlInsert, (err, result) => {
        res.send(result);
    });
});

app.listen(3001, () => {
    console.log("running on port 3001");
});