-- plague kills human

START TRANSACTION;

UPDATE simulation
SET num_deceased = num_deceased + 1
WHERE id = (simulation id);

SELECT @human:=NULL;

SELECT @human:=num
FROM simulation_humans, infection
WHERE num = (human num) AND id = (simulation id) AND status = 'alive'
AND human = (human num) AND human_id = (simulation_id);

DELETE FROM infection WHERE human= (human num) AND human_id = (simulation_id);

UPDATE simulation_humans
SET status = 'dead'
WHERE num = (human num) AND id = (simulation id) AND status = 'alive';

CALL `user_schema`.`checkRollback`(@human);