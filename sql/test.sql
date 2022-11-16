-- test human

SELECT IF(EXISTS (SELECT * FROM infection
WHERE human = (human num) AND human_id = (simulation id)), 'positive', 'negative');

UPDATE infection
SET known = 1
WHERE human = (human num) AND human_id = (simulation id);
