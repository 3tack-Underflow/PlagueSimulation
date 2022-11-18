DELETE FROM user;
DELETE FROM simulation; -- will delete all tables related to the simulation due to ON DELETE CASCADE
DELETE FROM symptom;