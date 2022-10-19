-- TEST FOR FEATURE 2, MAIN SCREEN -- 

-- initial select all --
SELECT * FROM simulation_participation;

-- 1) find which simulations belong to a user, for example grace --
SELECT id
FROM simulation_participation
WHERE username = 'grace' and isOwner = true;

-- 2) find which simulations a user is part of, for example robert --
SELECT id
FROM simulation_participation
WHERE username = 'robert';

-- 3) see which users are part of a simulation, for example simulation 1 --
SELECT username
FROM simulation_participation
WHERE id = 1;

-- 4) add a user to a simulation, for example april to simulation 2 --
-- make sure there's less than 5 users and that we don't insert another owner --
INSERT INTO `user_schema`.`simulation_participation`(`username`,`id`,`isOwner`) 
SELECT 'april', 2, 0
WHERE (SELECT COUNT(username) FROM simulation_participation WHERE id = 2) < 5 
AND (SELECT max(isOwner) + 0 FROM simulation_participation WHERE id = 2) < 2;

-- select all after query 4 --
SELECT * FROM simulation_participation;

-- 5) add a user into a full simulation, which should modify 0 rows. For example jeff to simulation 1 --
INSERT INTO `user_schema`.`simulation_participation`(`username`,`id`,`isOwner`) 
SELECT 'jeff', 1, 0
WHERE (SELECT COUNT(username) FROM simulation_participation WHERE id = 1) < 5 
AND (SELECT max(isOwner) + 0 FROM simulation_participation WHERE id = 1) < 2;

-- select all after query 5 --
SELECT * FROM simulation_participation;