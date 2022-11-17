-- TEST FOR FEATURE 5, DETERMINE WHICH PLAGUE WILL MUTATE --

-- a plague will mutate if it is the most common variant of all the variants

-- given a simulation id = 1

SELECT plague FROM infection WHERE plague_id = 1 GROUP BY plague HAVING COUNT(*) = (SELECT MAX(count) FROM (SELECT plague, COUNT(*) as count FROM infection WHERE plague_id = 1 GROUP BY plague) as T);