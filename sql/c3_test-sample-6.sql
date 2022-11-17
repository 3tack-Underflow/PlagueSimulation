-- TEST FOR FEATURE 6, REMOVE A DEAD HUMAN FROM SIMULATION --

-- view current humans and available funds

SELECT * FROM simulation_humans WHERE id = 2;

SELECT environment_isolation_capacity, funds FROM simulation WHERE id = 2;

-- 1) delete a dead human, we have sufficient funds
-- here we are deleting human 1 (David) from simulation 2

START TRANSACTION;

-- subtract funds, query will fail if insufficient funds
UPDATE simulation
SET funds = funds - 50
WHERE id = 2;

UPDATE simulation
SET environment_isolation_capacity = environment_isolation_capacity + 1
WHERE (SELECT status, isolated FROM simulation_humans WHERE num = 1 AND id = 2) = ('dead', 1)
AND id = 2;

-- check that the dead human exists

SELECT @human:=NULL;

SELECT @human:=num
FROM simulation_humans
WHERE num = 1 AND id = 2 AND
status = 'dead';

-- refer to c2_createFunctions.sql for implementation of this function
-- rollback all changes if the human doesn't exist. Else commit.

DELETE FROM simulation_humans
WHERE num = 1 AND id = 2 AND
status = 'dead';

CALL `user_schema`.`checkRollback`(@human);

SELECT * FROM simulation_humans WHERE id = 2;

SELECT environment_isolation_capacity, funds FROM simulation WHERE id = 2;

-- 2) delete an alive human, nothing will be changed

START TRANSACTION;

-- subtract funds, query will fail if insufficient funds
UPDATE simulation
SET funds = funds - 50
WHERE id = 2;

UPDATE simulation
SET environment_isolation_capacity = environment_isolation_capacity + 1
WHERE (SELECT status, isolated FROM simulation_humans WHERE num = 3 AND id = 2) = ('dead', 1)
AND id = 2;

-- check that the dead human exists

SELECT @human:=NULL;

SELECT @human:=num
FROM simulation_humans
WHERE num = 3 AND id = 2 AND
status = 'dead';

-- refer to c2_createFunctions.sql for implementation of this function
-- rollback all changes if the human doesn't exist

DELETE FROM simulation_humans
WHERE num = 3 AND id = 2 AND
status = 'dead';

CALL `user_schema`.`checkRollback`(@human);

SELECT * FROM simulation_humans WHERE id = 2;

SELECT environment_isolation_capacity, funds FROM simulation WHERE id = 2;

-- 3) delete a human that doesn't exist, nothing will be changed

START TRANSACTION;

-- subtract funds, query will fail if insufficient funds
UPDATE simulation
SET funds = funds - 50
WHERE id = 2;

UPDATE simulation
SET environment_isolation_capacity = environment_isolation_capacity + 1
WHERE (SELECT status, isolated FROM simulation_humans WHERE num = 10 AND id = 2) = ('dead', 1)
AND id = 2;

-- check that the dead human exists

SELECT @human:=NULL;

SELECT @human:=num
FROM simulation_humans
WHERE num = 10 AND id = 2 AND
status = 'dead';

-- refer to c2_createFunctions.sql for implementation of this function
-- rollback all changes if the human doesn't exist

DELETE FROM simulation_humans
WHERE num = 10 AND id = 2 AND
status = 'dead';

CALL `user_schema`.`checkRollback`(@human);

SELECT * FROM simulation_humans WHERE id = 2;

SELECT environment_isolation_capacity, funds FROM simulation WHERE id = 2;

-- 4) delete a human though funds are insufficient. Nothing will be changed

UPDATE simulation
SET funds = 0
WHERE id = 2;

START TRANSACTION;

-- subtract funds, query will fail if insufficient funds
UPDATE simulation
SET funds = funds - 50
WHERE id = 2;

UPDATE simulation
SET environment_isolation_capacity = environment_isolation_capacity + 1
WHERE (SELECT status, isolated FROM simulation_humans WHERE num = 2 AND id = 2) = ('dead', 1)
AND id = 2;

-- check that the dead human exists

SELECT @human:=num
FROM simulation_humans
WHERE num = 2 AND id = 2 AND
status = 'dead';

-- refer to c2_createFunctions.sql for implementation of this function
-- rollback all changes if the human doesn't exist

DELETE FROM simulation_humans
WHERE num = 2 AND id = 2;

CALL `user_schema`.`checkRollback`(@human);

SELECT * FROM simulation_humans WHERE id = 2;

SELECT environment_isolation_capacity, funds FROM simulation WHERE id = 2;

-- 4) delete an isolated dead human. Nothing will be changed

UPDATE simulation
SET funds = 950
WHERE id = 2;

START TRANSACTION;

-- subtract funds, query will fail if insufficient funds
UPDATE simulation
SET funds = funds - 50
WHERE id = 2;

UPDATE simulation
SET environment_isolation_capacity = environment_isolation_capacity + 1
WHERE (SELECT status, isolated FROM simulation_humans WHERE num = 2 AND id = 2) = ('dead', 1)
AND id = 2;

-- check that the dead human exists

SELECT @human:=num
FROM simulation_humans
WHERE num = 2 AND id = 2 AND
status = 'dead';

-- refer to c2_createFunctions.sql for implementation of this function
-- rollback all changes if the human doesn't exist

DELETE FROM simulation_humans
WHERE num = 2 AND id = 2;

CALL `user_schema`.`checkRollback`(@human);

SELECT * FROM simulation_humans WHERE id = 2;

SELECT environment_isolation_capacity, funds FROM simulation WHERE id = 2;
