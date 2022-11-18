-- TEST FOR FEATURE 3, VIEW USER/SIMULATION INFORMATION -- 

-- initial select all --
SELECT * FROM simulation_participation;

-- 1) find which simulations belong to a user, for example grace --

SELECT id
FROM simulation_participation
WHERE username = 'grace' and is_owner = true;
-- 2) find which simulations a user is part of, for example robert --
SELECT id
FROM simulation_participation
WHERE username = 'robert';

-- 3) see which users are part of a simulation, for example simulation 1 --
SELECT username
FROM simulation_participation
WHERE id = 1;
