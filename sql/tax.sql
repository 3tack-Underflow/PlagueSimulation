-- display tax

SELECT SUM(tax) FROM simulation_humans
WHERE id = (simulation id) AND status = 'alive' AND isolated = 0;

-- collect tax

UPDATE simulation
SET funds = funds + (SELECT SUM(tax) FROM simulation_humans WHERE id = (simulation id) AND status = 'alive' AND isolated = 0)
WHERE id = (simulation id);