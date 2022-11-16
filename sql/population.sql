-- get alive population

SELECT COUNT(*) FROM simulation_humans
WHERE id = (simulation id) AND status = 'alive';
