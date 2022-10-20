-- TEST FOR FEATURE 4, ADD USER TO SIMULATION --

-- initial select all --
SELECT * FROM simulation_participation;

-- 1) add a user to a simulation, for example april to simulation 2 --
-- make sure there's less than 5 users and that we don't insert another owner --
INSERT INTO `simulation_participation`(`username`,`id`,`isOwner`) 
SELECT 'april', 2, 0
WHERE (SELECT COUNT(username) FROM simulation_participation WHERE id = 2) < 5 
AND (SELECT max(isOwner) + 0 FROM simulation_participation WHERE id = 2) < 2;

-- select all after query 1 --
SELECT * FROM simulation_participation;

-- 2) add a user into a full simulation, which should modify 0 rows. For example jeff to simulation 1 --
INSERT INTO `simulation_participation`(`username`,`id`,`isOwner`) 
SELECT 'jeff', 1, 0
WHERE (SELECT COUNT(username) FROM simulation_participation WHERE id = 1) < 5 
AND (SELECT max(isOwner) + 0 FROM simulation_participation WHERE id = 1) < 2;

-- select all after query 2 --
SELECT * FROM simulation_participation;