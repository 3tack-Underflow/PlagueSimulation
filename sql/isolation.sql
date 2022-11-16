-- isolate human
-- these should be done in succession
-- 2nd query shouldn't be executed if 1st fails
-- please implement in api
UPDATE 'simulation'
SET funds = funds - (isolation cost),
    environment_isolation_capacity = environment_isolation_capacity - 1
WHERE id = (simulation id);

UPDATE simulation_humans
SET status = 'isolated'
WHERE status = 'alive' 
AND num = (human num) AND id = (simulation id);

-- un-isolate human
-- these should be done in succession
-- 2nd query shouldn't be executed if 1st fails
-- please implement in api
UPDATE 'simulation'
SET environment_isolation_capacity = environment_isolation_capacity + 1
WHERE id = (simulation id);

UPDATE simulation_humans
SET status = 'alive'
WHERE status = 'isolated';