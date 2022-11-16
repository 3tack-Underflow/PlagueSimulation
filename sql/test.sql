-- test human

UPDATE simulation
SET funds = funds - (test cost)
WHERE id = (sim id);

SELECT @human:=num
FROM simulation_humans
WHERE num = (human num) AND id = (sim id)
AND status = 'alive';

CALL `user_schema`.`checkRollback`(@human);

SELECT IF(EXISTS (SELECT * FROM infection
WHERE human = (human num) AND human_id = (simulation id)), 'positive', 'negative');

UPDATE infection
SET known = 1
WHERE human = (human num) AND human_id = (simulation id);
