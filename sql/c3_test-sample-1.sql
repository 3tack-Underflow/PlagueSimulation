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

INSERT INTO `simulation`
(`sim_name`, `creation_time`, `completion_time`, `last_modified_time`, `environment_starting_population`, `environment_isolation_capacity`, `status`, `num_deceased`, `seed`, `funds`)
VALUES('Goose Disease', '2022-11-13 04:41:55', NULL, '2022-11-13 04:42:33', 3, 10, 'ongoing', 0, 'seed', 1000);

-- record the id of the most recently created simulation

SELECT @simId:=LAST_INSERT_ID();

-- Make a user an owner

INSERT INTO `simulation_participation`(`username`,`id`,`is_owner`) VALUES ('jeff', @simId, 1);

-- create the humans --

INSERT INTO `simulation_humans`(`num`, `id`, `age`, `weight`, `height`, `blood_sugar`, `blood_pressure`, `cholesterol`, `radiation`, `x`, `y`, `tax`, `name`, `gender`)
VALUES (1, @simId, 72, 136, 100, 120, 150, 20, 3, 5, 10, 10, 'Blorky', 'F');
INSERT INTO `simulation_humans`(`num`, `id`, `age`, `weight`, `height`, `blood_sugar`, `blood_pressure`, `cholesterol`, `radiation`, `x`, `y`, `tax`, `name`, `gender`)
VALUES (2, @simId, 3, 30, 160, 170, 30, 40, 5, 100, 10, 10, 'Dolanda', 'F');
INSERT INTO `simulation_humans`(`num`, `id`, `age`, `weight`, `height`, `blood_sugar`, `blood_pressure`, `cholesterol`, `radiation`, `x`, `y`, `tax`, `name`, `gender`)
VALUES (3, @simId, 51, 125, 100, 125, 10, 36, 47, 10, 17, 50, 'Dolce', 'F');
INSERT INTO `simulation_humans`(`num`, `id`, `age`, `weight`, `height`, `blood_sugar`, `blood_pressure`, `cholesterol`, `radiation`, `x`, `y`, `tax`, `name`, `gender`)
VALUES (4, @simId, 51, 135, 180, 170, 35, 10, 10, 80, 190, 0, 'Leon', 'M');
INSERT INTO `simulation_humans`(`num`, `id`, `age`, `weight`, `height`, `blood_sugar`, `blood_pressure`, `cholesterol`, `radiation`, `x`, `y`, `tax`, `name`, `gender`)
VALUES (5, @simId, 92, 121, 90, 100, 28, 35, 80, 10, 45, 0, 'Amber', 'F');
INSERT INTO `simulation_humans`(`num`, `id`, `age`, `weight`, `height`, `blood_sugar`, `blood_pressure`, `cholesterol`, `radiation`, `x`, `y`, `tax`, `name`, `gender`)
VALUES (6, @simId, 1, 10, 130, 70, 89, 2, 50, 10, 82, 1, 'Dylas','M');

-- give the infected ones symptoms --

INSERT INTO `showing_symptoms`(`num`, `id`, `name`, `start_time`) VALUES (4, @simId, "fever", 0);
INSERT INTO `showing_symptoms`(`num`, `id`, `name`, `start_time`) VALUES (4, @simId, "runny nose", 0);
INSERT INTO `showing_symptoms`(`num`, `id`, `name`, `start_time`) VALUES (6, @simId, "nausea", 0);

-- check that our simulation has humans

SELECT * FROM simulation_humans WHERE id = @simId;

-- check that our infected humans have symptoms

SELECT * FROM showing_symptoms WHERE id = @simId;

