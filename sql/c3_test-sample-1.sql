-- TEST FOR FEATURE 1, REGISTER/GENERATING SIMULATION HUMANS --

-- REGISTER --

-- initial select all --
SELECT * FROM user;

-- 1) Register a new account, for example username = mark and password = iLAk5L? --
INSERT INTO `user`(`username`,`password`) VALUES ('mark', 'iLAk5L?');

-- select all after query 1 --
SELECT * FROM user;

-- 2) Register a new account where the username is taken, for example username = grace and password = dimaL8! --
INSERT INTO `user`(`username`,`password`) VALUES ('grace', 'dimaL8!');

-- select all after query 2 --
SELECT * FROM user;

-----------------------------------------------------------------------------------------------------------------------------------------------------

-- GENERATING SIMULATION HUMANS --

-- Create a new simulation --

INSERT INTO `simulation` (`disease_name`, `settings_severity`, `settings_max_rules`, `environment_total_population`, `environment_isolation_capacity`, `disease_spread_rate`, `disease_spread_radius`, `disease_mutation_time`, `funds`) 
VALUES ("Goose Disease", 1, 7, 6, 2, 3, 5, 5, 100);

-- record the id of the most recently created simulation

SELECT LAST_INSERT_ID(); -- assume this is 8

-- Make a user an owner

INSERT INTO `simulation_participation`(`username`,`id`,`is_owner`) VALUES ('jeff', 8, 1);

-- create the humans --

INSERT INTO `simulation_humans`(`num`, `id`, `is_infected`, `age`, `weight`)
VALUES (1, 8, 0, 72, 136.2);
INSERT INTO `simulation_humans`(`num`, `id`, `is_infected`, `age`, `weight`)
VALUES (2, 8, 0, 3, 30);
INSERT INTO `simulation_humans`(`num`, `id`, `is_infected`, `age`, `weight`)
VALUES (3, 8, 0, 51, 125.5);
INSERT INTO `simulation_humans`(`num`, `id`, `is_infected`, `age`, `weight`)
VALUES (4, 8, 1, 51, 135.5);
INSERT INTO `simulation_humans`(`num`, `id`, `is_infected`, `age`, `weight`)
VALUES (5, 8, 0, 92, 121.8);
INSERT INTO `simulation_humans`(`num`, `id`, `is_infected`, `age`, `weight`)
VALUES (6, 8, 1, 1, 10.9);

-- give the infected ones symptoms --

INSERT INTO `showing_symptoms`(`num`, `id`, `name`, `start_time`) VALUES (4, 8, "fever", 0);
INSERT INTO `showing_symptoms`(`num`, `id`, `name`, `start_time`) VALUES (4, 8, "runny nose", 0);
INSERT INTO `showing_symptoms`(`num`, `id`, `name`, `start_time`) VALUES (6, 8, "nausea", 0);

-- check that our simulation has humans

SELECT * FROM simulation_humans WHERE id = 8;

-- check that our infected humans have symptoms

SELECT * FROM showing_symptoms WHERE id = 8

