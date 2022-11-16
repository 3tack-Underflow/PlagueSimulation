-- add vaccine to table

CREATE TRANSACTION;

-- update funds
UPDATE simulation
SET funds = funds - (vaccine cost)
WHERE id = (simulation id);

INSERT INTO vaccine
(`id`)
VALUES(simulation id);

SELECT @vac = LAST_INSERT_ID();

-- add rule

INSERT INTO vaccine_rules
(`vaccine`, `id`, `category`, `range_lower`, `range_upper`)
VALUES (vac, (simulation id), (category), (range lower), (range upper));

COMMIT;
