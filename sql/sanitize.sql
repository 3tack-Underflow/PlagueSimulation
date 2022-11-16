-- remove a dead human
-- return the isolation space if they were isolated

START TRANSACTION;

-- subtract funds, query will fail if insufficient funds
UPDATE simulation
SET funds = funds - (sanitize cost)
WHERE id = (simulation id);

UPDATE simulation
SET environment_isolation_capacity = environment_isolation_capacity + 1
WHERE (SELECT status, isolated FROM simulation_humans WHERE num = (human num) AND id = (simulation id)) = ('dead', 1)
AND id = (simulation id);

SELECT @human:=num
FROM simulation_humans
WHERE num = (human num) AND id = (simulation id) AND
status = 'dead';

CALL `user_schema`.`checkRollback`(@human);

DELETE FROM simulation_humans
WHERE num = (human num) AND id = (simulation id);

COMMIT;