-- plague kills human
-- these should be done in succession
-- 3rd query shouldn't be executed if 1st and 2nd both change nothing
-- please implement in api
UPDATE simulation_humans
SET status = 'dead'
WHERE status IN ('alive')
AND num = (human num) AND id = (simulation id);

UPDATE simulation_humans
SET status = 'deadAndIsolated'
WHERE status IN ('isolated')
AND num = (human num) AND id = (simulation id);

UPDATE simulation
SET num_deceased = num_deceased + 1
WHERE id = (simulation id);