-- remove a dead human
-- return the isolation space if they were isolated
-- these should be done in succession
-- 2nd and 3rd query shouldn't be executed if 1st fails
-- please implement in api
UPDATE simulation
SET funds = funds - (sanitize cost)
WHERE id = (simulation id);

UPDATE simulation
SET environment_isolation_capacity = environment_isolation_capacity + 1
WHERE (SELECT status FROM simulation_humans WHERE num = (human num) AND id = (simulation id)) = 'deadAndIsolated'
AND id = (simulation id);

DELETE FROM simulation_humans
WHERE status = 'dead'
AND num = (human num) AND id = (simulation id);