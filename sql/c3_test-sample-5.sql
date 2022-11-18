-- TEST FOR FEATURE 5, DETERMINE WHICH PLAGUE WILL MUTATE --

-- a plague will mutate if it is the most common variant of all the variants

-- given a simulation id = 1

-- view all infections from simulation 1 --

SELECT * FROM infection WHERE plague_id = 1;

SELECT plague FROM infection WHERE plague_id = 1 GROUP BY plague HAVING COUNT(*) = (SELECT MAX(count) FROM (SELECT plague, COUNT(*) as count FROM infection WHERE plague_id = 1 GROUP BY plague) as T);

-- remove an infection from simulation 1. Now both are the most common --
DELETE FROM infection WHERE human = 1 AND human_id = 1 AND plague = 1 AND plague_id = 1;

SELECT plague FROM infection WHERE plague_id = 1 GROUP BY plague HAVING COUNT(*) = (SELECT MAX(count) FROM (SELECT plague, COUNT(*) as count FROM infection WHERE plague_id = 1 GROUP BY plague) as T);
