-- isolate human

START TRANSACTION;

UPDATE simulation
SET funds = funds - (isolation cost),
    environment_isolation_capacity = environment_isolation_capacity - 1
WHERE id = (sim id);

SELECT @human:=num
FROM simulation_humans
WHERE num = (human num) AND id = (sim id) AND
isolated = 0 AND status = 'alive';

UPDATE simulation_humans
SET isolated = 1
WHERE num = (human num) AND id = (sim id) AND
isolated = 0 AND status = 'alive';

CALL `user_schema`.`checkRollback`(@human);

-- un-isolate human

START TRANSACTION;

UPDATE 'simulation'
SET environment_isolation_capacity = environment_isolation_capacity + 1
WHERE id = (simulation id);

SELECT @human:=num
FROM simulation_humans
WHERE num = (human num) AND id = (simulation id) AND
isolated = 1 AND status = 'alive';

UPDATE simulation_humans
SET isolated = 0
WHERE num = (human num) AND id = (simulation id) AND
isolated = 1 AND status = 'alive';

CALL `user_schema`.`checkRollback`(@human);