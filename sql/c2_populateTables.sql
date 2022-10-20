INSERT INTO `user`(`username`,`password`) VALUES ('grace','JTECKk1!');
INSERT INTO `user`(`username`,`password`) VALUES ('troy','jfnm84?');
INSERT INTO `user`(`username`,`password`) VALUES ('robert','VVx5eX!');
INSERT INTO `user`(`username`,`password`) VALUES ('nathan','8AaY3r?');
INSERT INTO `user`(`username`,`password`) VALUES ('april','eYa5tdX!');
INSERT INTO `user`(`username`,`password`) VALUES ('jeff','dkltR1?');

INSERT INTO `simulation`
(`disease_name`, `settings_severity`, `settings_max_rules`, `environment_total_population`, `environment_isolation_capacity`, `disease_spread_rate`, `disease_spread_radius`, `disease_mutation_time`, `funds`)
VALUES('Lingering Death', 3, 10, 5, 0, 5, 10, 10, 100);
INSERT INTO `simulation`
(`disease_name`, `settings_severity`, `settings_max_rules`, `environment_total_population`, `environment_isolation_capacity`, `disease_spread_rate`, `disease_spread_radius`, `disease_mutation_time`, `funds`)
VALUES('COVID-19', 2, 5, 4, 10, 3, 7, 5, 200);
INSERT INTO `simulation`
(`disease_name`, `settings_severity`, `settings_max_rules`, `environment_total_population`, `environment_isolation_capacity`, `disease_spread_rate`, `disease_spread_radius`, `disease_mutation_time`, `funds`)
VALUES('Bloinky', 3, 10, 5, 6, 5, 10, 15, 300);
INSERT INTO `simulation`
(`disease_name`, `settings_severity`, `settings_max_rules`, `environment_total_population`, `environment_isolation_capacity`, `disease_spread_rate`, `disease_spread_radius`, `disease_mutation_time`, `funds`)
VALUES('Alan', 1, 3, 1, 6, 5, 3, 15, 400);

INSERT INTO `simulation_participation`(`username`,`id`,`is_owner`) VALUES ('grace', 1, 1);
INSERT INTO `simulation_participation`(`username`,`id`,`is_owner`) VALUES ('troy', 1, 0);
INSERT INTO `simulation_participation`(`username`,`id`,`is_owner`) VALUES ('robert', 1, 0);
INSERT INTO `simulation_participation`(`username`,`id`,`is_owner`) VALUES ('nathan', 1, 0);
INSERT INTO `simulation_participation`(`username`,`id`,`is_owner`) VALUES ('april', 1, 0);
INSERT INTO `simulation_participation`(`username`,`id`,`is_owner`) VALUES ('jeff', 2, 1);
INSERT INTO `simulation_participation`(`username`,`id`,`is_owner`) VALUES ('robert', 2, 0);
INSERT INTO `simulation_participation`(`username`,`id`,`is_owner`) VALUES ('robert', 3, 1);
INSERT INTO `simulation_participation`(`username`,`id`,`is_owner`) VALUES ('robert', 4, 1);

INSERT INTO `simulation_humans`(`num`, `id`, `is_infected`, `age`, `weight`)
VALUES (1, 1, 0, 27, 150.0);
INSERT INTO `simulation_humans`(`num`, `id`, `is_infected`, `age`, `weight`)
VALUES (2, 1, 0, 30, 160.5);
INSERT INTO `simulation_humans`(`num`, `id`, `is_infected`, `age`, `weight`)
VALUES (3, 1, 1, 15, 125.5);
INSERT INTO `simulation_humans`(`num`, `id`, `is_infected`, `age`, `weight`)
VALUES (1, 2, 1, 15, 125.5);
INSERT INTO `simulation_humans`(`num`, `id`, `is_infected`, `age`, `weight`)
VALUES (2, 2, 1, 29, 145.0);
INSERT INTO `simulation_humans`(`num`, `id`, `is_infected`, `age`, `weight`)
VALUES (3, 2, 1, 10, 110.5);
INSERT INTO `simulation_humans`(`num`, `id`, `is_infected`, `age`, `weight`)
VALUES (4, 2, 1, 17, 130.5);
INSERT INTO `simulation_humans`(`num`, `id`, `is_infected`, `age`, `weight`)
VALUES (1, 3, 1, 80, 137.7);
INSERT INTO `simulation_humans`(`num`, `id`, `is_infected`, `age`, `weight`)
VALUES (2, 3, 1, 90, 155.5);
INSERT INTO `simulation_humans`(`num`, `id`, `is_infected`, `age`, `weight`)
VALUES (3, 3, 1, 87, 112.5);
INSERT INTO `simulation_humans`(`num`, `id`, `is_infected`, `age`, `weight`)
VALUES (4, 3, 1, 70, 145.5);
INSERT INTO `simulation_humans`(`num`, `id`, `is_infected`, `age`, `weight`)
VALUES (5, 3, 1, 67, 128.0);
INSERT INTO `simulation_humans`(`num`, `id`, `is_infected`, `age`, `weight`)
VALUES (1, 4, 0, 4, 30.0);

INSERT INTO `symptom`(`name`) VALUES ('runny nose');
INSERT INTO `symptom`(`name`) VALUES ('sore throat');
INSERT INTO `symptom`(`name`) VALUES ('fever');
INSERT INTO `symptom`(`name`) VALUES ('nausea');
INSERT INTO `symptom`(`name`) VALUES ('muscle weakness');

INSERT INTO `showing_symptoms`(`num`, `id`, `name`, `start_time`)VALUES(1, 1, 'sore throat', 5);
INSERT INTO `showing_symptoms`(`num`, `id`, `name`, `start_time`)VALUES(1, 1, 'fever', 10);
INSERT INTO `showing_symptoms`(`num`, `id`, `name`, `start_time`)VALUES(1, 1, 'nausea', 1005);
INSERT INTO `showing_symptoms`(`num`, `id`, `name`, `start_time`)VALUES(2, 1, 'muscle weakness', 0);
INSERT INTO `showing_symptoms`(`num`, `id`, `name`, `start_time`)VALUES(3, 1, 'sore throat', 1200);
INSERT INTO `showing_symptoms`(`num`, `id`, `name`, `start_time`)VALUES(3, 1, 'fever', 60);
INSERT INTO `showing_symptoms`(`num`, `id`, `name`, `start_time`)VALUES(3, 1, 'nausea', 48);
INSERT INTO `showing_symptoms`(`num`, `id`, `name`, `start_time`)VALUES(1, 2, 'sore throat', 20);
INSERT INTO `showing_symptoms`(`num`, `id`, `name`, `start_time`)VALUES(1, 2, 'fever', 20);
INSERT INTO `showing_symptoms`(`num`, `id`, `name`, `start_time`)VALUES(1, 2, 'nausea', 20);
INSERT INTO `showing_symptoms`(`num`, `id`, `name`, `start_time`)VALUES(2, 2, 'runny nose', 55);
INSERT INTO `showing_symptoms`(`num`, `id`, `name`, `start_time`)VALUES(2, 3, 'runny nose', 67);
INSERT INTO `showing_symptoms`(`num`, `id`, `name`, `start_time`)VALUES(5, 3, 'nausea', 19);
