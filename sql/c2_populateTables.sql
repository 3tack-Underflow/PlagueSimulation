INSERT INTO `user`(`username`,`password`) VALUES ('grace','JTECKk1!');
INSERT INTO `user`(`username`,`password`) VALUES ('troy','jfnm84?');
INSERT INTO `user`(`username`,`password`) VALUES ('robert','VVx5eX!');
INSERT INTO `user`(`username`,`password`) VALUES ('nathan','8AaY3r?');
INSERT INTO `user`(`username`,`password`) VALUES ('april','eYa5tdX!');
INSERT INTO `user`(`username`,`password`) VALUES ('jeff','dkltR1?');

INSERT INTO `simulation`
(`sim_name`, `creation_time`, `completion_time`, `last_modified_time`, `environment_starting_population`, `environment_isolation_capacity`, `status`, `num_deceased`, `seed`, `funds`)
VALUES('Lingering Death', '2022-11-13 04:41:55', NULL, '2022-11-13 04:42:33', 3, 10, 'ongoing', 0, 'seed', 1000);
INSERT INTO `simulation`
(`sim_name`, `creation_time`, `completion_time`, `last_modified_time`, `environment_starting_population`, `environment_isolation_capacity`, `status`, `num_deceased`, `seed`, `funds`)
VALUES('George', '2020-11-27 12:41:55', '2022-11-13 04:42:33', '2022-11-13 04:42:33', 8, 5, 'success', 4, 'meorp', 1000);
INSERT INTO `simulation`
(`sim_name`, `creation_time`, `completion_time`, `last_modified_time`, `environment_starting_population`, `environment_isolation_capacity`, `status`, `num_deceased`, `seed`, `funds`)
VALUES('Bloinky', '2020-3-27 01:41:55', '2022-5-14 04:42:33', '2022-5-14 04:42:33', 8, 5, 'fail', 5, 'aaaa', 200);
INSERT INTO `simulation`
(`sim_name`, `creation_time`, `completion_time`, `last_modified_time`, `environment_starting_population`, `environment_isolation_capacity`, `status`, `num_deceased`, `seed`, `funds`)
VALUES('Alan McRoblox', '2020-3-27 01:41:55', NULL, '2020-3-27 01:41:55', 1, 200, 'ongoing', 0, 'aaaa', 5);

INSERT INTO `simulation_participation`(`username`,`id`,`is_owner`) VALUES ('grace', 1, 1);
INSERT INTO `simulation_participation`(`username`,`id`,`is_owner`) VALUES ('troy', 1, 0);
INSERT INTO `simulation_participation`(`username`,`id`,`is_owner`) VALUES ('robert', 1, 0);
INSERT INTO `simulation_participation`(`username`,`id`,`is_owner`) VALUES ('nathan', 1, 0);
INSERT INTO `simulation_participation`(`username`,`id`,`is_owner`) VALUES ('april', 1, 0);
INSERT INTO `simulation_participation`(`username`,`id`,`is_owner`) VALUES ('jeff', 2, 1);
INSERT INTO `simulation_participation`(`username`,`id`,`is_owner`) VALUES ('robert', 2, 0);
INSERT INTO `simulation_participation`(`username`,`id`,`is_owner`) VALUES ('robert', 3, 1);
INSERT INTO `simulation_participation`(`username`,`id`,`is_owner`) VALUES ('robert', 4, 1);

INSERT INTO `simulation_humans`(`num`, `id`, `age`, `weight`, `height`, `blood_sugar`, `blood_pressure`, `cholesterol`, `radiation`, `x`, `y`, `tax`, `name`, `gender`)
VALUES (1, 1, 27, 150, 120, 100, 100, 50, 2, 150, 160, 10, 'Jason', 'M');
INSERT INTO `simulation_humans`(`num`, `id`, `age`, `weight`, `height`, `blood_sugar`, `blood_pressure`, `cholesterol`, `radiation`, `x`, `y`, `tax`, `name`, `gender`)
VALUES (2, 1, 30, 160, 150, 100, 100, 50, 2, 125, 0, 10, 'Junya', 'F');
INSERT INTO `simulation_humans`(`num`, `id`, `age`, `weight`, `height`, `blood_sugar`, `blood_pressure`, `cholesterol`, `radiation`, `x`, `y`, `tax`, `name`, `gender`)
VALUES (3, 1, 15, 125, 120, 100, 100, 50, 2, 40, 80, 5, 'Alan', 'M');
INSERT INTO `simulation_humans`(`num`, `id`, `status`, `age`, `weight`, `height`, `blood_sugar`, `blood_pressure`, `cholesterol`, `radiation`, `x`, `y`, `tax`, `name`, `gender`)
VALUES (1, 2, 'dead', 15, 125, 105, 100, 125, 50, 2, 65, 24, 10, 'David', 'M');
INSERT INTO `simulation_humans`(`num`, `id`, `status`, `isolated`, `age`, `weight`, `height`, `blood_sugar`, `blood_pressure`, `cholesterol`, `radiation`, `x`, `y`, `tax`, `name`, `gender`)
VALUES (2, 2, 'dead', 1, 29, 145, 111, 100, 100, 50, 2, 37, 38, 10, 'Henry', 'M');
INSERT INTO `simulation_humans`(`num`, `id`, `age`, `weight`, `height`, `blood_sugar`, `blood_pressure`, `cholesterol`, `radiation`, `x`, `y`, `tax`, `name`, `gender`)
VALUES (3, 2, 10, 110, 132, 95, 95, 20, 0, 20, 25, 5, 'Tyler', 'M');
INSERT INTO `simulation_humans`(`num`, `id`, `age`, `weight`, `height`, `blood_sugar`, `blood_pressure`, `cholesterol`, `radiation`, `x`, `y`, `tax`, `name`, `gender`)
VALUES (4, 2, 17, 130, 105, 97, 100, 75, 0, -20, -50, 5, 'Shehab', 'M');
INSERT INTO `simulation_humans`(`num`, `id`, `status`, `age`, `weight`, `height`, `blood_sugar`, `blood_pressure`, `cholesterol`, `radiation`, `x`, `y`, `tax`, `name`, `gender`)
VALUES (1, 3, 'dead', 80, 137, 111, 100, 100, 50, 2, 100, -150, 10, 'Guansong', 'M');
INSERT INTO `simulation_humans`(`num`, `id`, `status`, `age`, `weight`, `height`, `blood_sugar`, `blood_pressure`, `cholesterol`, `radiation`, `x`, `y`, `tax`, `name`, `gender`)
VALUES (2, 3, 'dead', 90, 155, 111, 125, 90, 50, 2, 37, 38, 10, 'Kevin', 'M');
INSERT INTO `simulation_humans`(`num`, `id`, `status`, `age`, `weight`, `height`, `blood_sugar`, `blood_pressure`, `cholesterol`, `radiation`, `x`, `y`, `tax`, `name`, `gender`)
VALUES (3, 3, 'dead', 87, 112, 200, 40, 100, 50, 2, 39, 38, 10, 'Emma', 'F');
INSERT INTO `simulation_humans`(`num`, `id`, `status`, `age`, `weight`, `height`, `blood_sugar`, `blood_pressure`, `cholesterol`, `radiation`, `x`, `y`, `tax`, `name`, `gender`)
VALUES (4, 3, 'dead', 70, 145, 111, 100, 70, 50, 2, 30, 32, 10, 'Viktor', 'M');
INSERT INTO `simulation_humans`(`num`, `id`, `status`, `age`, `weight`, `height`, `blood_sugar`, `blood_pressure`, `cholesterol`, `radiation`, `x`, `y`, `tax`, `name`, `gender`)
VALUES (5, 3, 'dead', 67, 128, 111, 100, 80, 50, 100, 25, 42, 10, 'Vi', 'F');
INSERT INTO `simulation_humans`(`num`, `id`, `age`, `weight`, `height`, `blood_sugar`, `blood_pressure`, `cholesterol`, `radiation`, `x`, `y`, `tax`, `name`, `gender`)
VALUES (1, 4, 4, 30, 50, 100, 100, 50, 2, 39, 38, 10, 'Jinx', 'F');

INSERT INTO `plague` (`variant`, `id`, `strength`, `spread_chance`, `spread_radius`, `spread_cooldown`, `mutation_chance`, `curing_threshhold`, `fatality_threshhold`, `death_rate`, `death_cooldown`)
VALUES (1, 1, 50, 20, 25, 40, 30, 50, 20, 1, 100);
INSERT INTO `plague` (`variant`, `id`, `strength`, `spread_chance`, `spread_radius`, `spread_cooldown`, `mutation_chance`, `curing_threshhold`, `fatality_threshhold`, `death_rate`, `death_cooldown`)
VALUES (1, 2, 40, 20, 30, 15, 17, 18, 18, 5, 25);
INSERT INTO `plague` (`variant`, `id`, `strength`, `spread_chance`, `spread_radius`, `spread_cooldown`, `mutation_chance`, `curing_threshhold`, `fatality_threshhold`, `death_rate`, `death_cooldown`)
VALUES (2, 2, 40, 20, 30, 15, 17, 18, 18, 10, 10);
INSERT INTO `plague` (`variant`, `id`, `strength`, `spread_chance`, `spread_radius`, `spread_cooldown`, `mutation_chance`, `curing_threshhold`, `fatality_threshhold`, `death_rate`, `death_cooldown`)
VALUES (3, 3, 40, 20, 30, 15, 17, 18, 18, 100, 5);
INSERT INTO `plague` (`variant`, `id`, `strength`, `spread_chance`, `spread_radius`, `spread_cooldown`, `mutation_chance`, `curing_threshhold`, `fatality_threshhold`, `death_rate`, `death_cooldown`)
VALUES (4, 1, 17, 14, 19, 30, 35, 19, 42, 37, 38);

INSERT INTO `plague_rules` (`variant`, `id`, `category`, `range_lower`, `range_upper`, `match_value`, `miss_value`)
VALUES (1, 1, 'age', null, 20, 30, 30);
INSERT INTO `plague_rules` (`variant`, `id`, `category`, `range_lower`, `range_upper`, `match_value`, `miss_value`)
VALUES (1, 1, 'age', 30, null, 40, 40);
INSERT INTO `plague_rules` (`variant`, `id`, `category`, `range_lower`, `range_upper`, `match_value`, `miss_value`)
VALUES (1, 2, 'weight', 100, 120, 30, 40);
INSERT INTO `plague_rules` (`variant`, `id`, `category`, `range_lower`, `range_upper`, `match_value`, `miss_value`)
VALUES (2, 2, 'weight', 100, 150, 30, 40);
INSERT INTO `plague_rules` (`variant`, `id`, `category`, `range_lower`, `range_upper`, `match_value`, `miss_value`)
VALUES (3, 3, 'height', 100, 100, 30, 40);
INSERT INTO `plague_rules` (`variant`, `id`, `category`, `range_lower`, `range_upper`, `match_value`, `miss_value`)
VALUES (4, 1, 'height', 50, 50, 30, 10);

INSERT INTO `infection` (`human`, `human_id`, `plague`, `plague_id`)
VALUES (1, 1, 1, 1);
INSERT INTO `infection` (`human`, `human_id`, `plague`, `plague_id`)
VALUES (2, 1, 1, 1);

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
