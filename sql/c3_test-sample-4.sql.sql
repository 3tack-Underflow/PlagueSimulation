-- TEST FOR FEATURE 4, CHECK IF HUMAN IS INFECTED --

-- suppose we are testing if human 1 from simulation 1 is infected --
-- a human who isn't already marked as infected is infected if he/she has the most common symptom
-- amongst all the symptoms shown by humans for the same simulation
-- 1 means true, 0 false

SELECT COUNT(*) WHERE 1 in 
(SELECT num FROM simulation_humans WHERE id = 1 AND num = 1 AND is_infected = 1) 
OR 
1 in (SELECT num FROM showing_symptoms, (SELECT name FROM showing_symptoms WHERE id = 1 GROUP BY name HAVING COUNT(*) = (SELECT MAX(count) as count FROM (SELECT name, COUNT(*) as count FROM showing_symptoms WHERE id = 1 GROUP BY name) as T)) as T WHERE num = 1 AND id = 1 AND showing_symptoms.name = T.name);

-- testing human 2 from simulation 1 --

SELECT COUNT(*) WHERE 2 in 
(SELECT num FROM simulation_humans WHERE id = 1 AND num = 2 AND is_infected = 1) 
OR 
2 in (SELECT num FROM showing_symptoms, (SELECT name FROM showing_symptoms WHERE id = 1 GROUP BY name HAVING COUNT(*) = (SELECT MAX(count) as count FROM (SELECT name, COUNT(*) as count FROM showing_symptoms WHERE id = 1 GROUP BY name) as T)) as T WHERE num = 2 AND id = 1 AND showing_symptoms.name = T.name);

-- testing human 1 from simulation 2 --

SELECT COUNT(*) WHERE 1 in 
(SELECT num FROM simulation_humans WHERE id = 2 AND num = 1 AND is_infected = 1) 
OR 
1 in (SELECT num FROM showing_symptoms, (SELECT name FROM showing_symptoms WHERE id = 2 GROUP BY name HAVING COUNT(*) = (SELECT MAX(count) as count FROM (SELECT name, COUNT(*) as count FROM showing_symptoms WHERE id = 2 GROUP BY name) as T)) as T WHERE num = 1 AND id = 2 AND showing_symptoms.name = T.name);

-- testing human 4 from simulation 1 (this human doesn't exist) --

SELECT COUNT(*) WHERE 4 in 
(SELECT num FROM simulation_humans WHERE id = 1 AND num = 4 AND is_infected = 1) 
OR 
4 in (SELECT num FROM showing_symptoms, (SELECT name FROM showing_symptoms WHERE id = 1 GROUP BY name HAVING COUNT(*) = (SELECT MAX(count) as count FROM (SELECT name, COUNT(*) as count FROM showing_symptoms WHERE id = 1 GROUP BY name) as T)) as T WHERE num = 4 AND id = 1 AND showing_symptoms.name = T.name);