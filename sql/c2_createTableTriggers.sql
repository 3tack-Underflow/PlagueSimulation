-- if all participants leave a simulation, delete the simulation
CREATE TRIGGER simulation_occupation
AFTER DELETE ON simulation_participation
FOR EACH ROW
	DELETE FROM simulation WHERE id = OLD.id AND NOT EXISTS (SELECT * FROM simulation_participation WHERE id = OLD.id);

