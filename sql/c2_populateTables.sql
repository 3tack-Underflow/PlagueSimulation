INSERT INTO `user_schema`.`user`(`username`,`password`) VALUES ('grace','JTECKk');
INSERT INTO `user_schema`.`user`(`username`,`password`) VALUES ('troy','jfnm84');
INSERT INTO `user_schema`.`user`(`username`,`password`) VALUES ('robert','VVx5eX');
INSERT INTO `user_schema`.`user`(`username`,`password`) VALUES ('nathan','8AaY3r');
INSERT INTO `user_schema`.`user`(`username`,`password`) VALUES ('april','eYatdX');
INSERT INTO `user_schema`.`user`(`username`,`password`) VALUES ('jeff','dkltR1');

INSERT INTO `user_schema`.`simulation`
(`settings_difficulty`, `environment_startingPop`, `environment_virusSpreadRate`, `environment_virusSpreadTemp`)
VALUES (1, 3, 5, 27.5);
INSERT INTO `user_schema`.`simulation`
(`settings_difficulty`, `environment_startingPop`, `environment_virusSpreadRate`, `environment_virusSpreadTemp`)
VALUES (2, 4, 10, 30.0);
INSERT INTO `user_schema`.`simulation`
(`settings_difficulty`, `environment_startingPop`, `environment_virusSpreadRate`, `environment_virusSpreadTemp`)
VALUES (3, 5, 2, 15.5);

INSERT INTO `user_schema`.`simulation_participation`(`username`,`id`,`isOwner`) VALUES ('grace', 1, 1);
INSERT INTO `user_schema`.`simulation_participation`(`username`,`id`,`isOwner`) VALUES ('troy', 1, 0);
INSERT INTO `user_schema`.`simulation_participation`(`username`,`id`,`isOwner`) VALUES ('robert', 1, 0);
INSERT INTO `user_schema`.`simulation_participation`(`username`,`id`,`isOwner`) VALUES ('nathan', 1, 0);
INSERT INTO `user_schema`.`simulation_participation`(`username`,`id`,`isOwner`) VALUES ('april', 1, 0);
INSERT INTO `user_schema`.`simulation_participation`(`username`,`id`,`isOwner`) VALUES ('jeff', 2, 1);
INSERT INTO `user_schema`.`simulation_participation`(`username`,`id`,`isOwner`) VALUES ('robert', 2, 0);

INSERT INTO `user_schema`.`simulation_humans`(`num`, `id`, `isInfected`, `age`, `weight`)
VALUES (1, 1, 0, 27, 150.0);
INSERT INTO `user_schema`.`simulation_humans`(`num`, `id`, `isInfected`, `age`, `weight`)
VALUES (2, 1, 0, 30, 160.5);
INSERT INTO `user_schema`.`simulation_humans`(`num`, `id`, `isInfected`, `age`, `weight`)
VALUES (3, 1, 1, 15, 125.5);
INSERT INTO `user_schema`.`simulation_humans`(`num`, `id`, `isInfected`, `age`, `weight`)
VALUES (1, 2, 1, 15, 125.5);
INSERT INTO `user_schema`.`simulation_humans`(`num`, `id`, `isInfected`, `age`, `weight`)
VALUES (2, 2, 1, 29, 145.0);
INSERT INTO `user_schema`.`simulation_humans`(`num`, `id`, `isInfected`, `age`, `weight`)
VALUES (3, 2, 1, 10, 110.5);
INSERT INTO `user_schema`.`simulation_humans`(`num`, `id`, `isInfected`, `age`, `weight`)
VALUES (4, 2, 1, 17, 130.5);
INSERT INTO `user_schema`.`simulation_humans`(`num`, `id`, `isInfected`, `age`, `weight`)
VALUES (1, 3, 1, 80, 137.7);
INSERT INTO `user_schema`.`simulation_humans`(`num`, `id`, `isInfected`, `age`, `weight`)
VALUES (2, 3, 1, 90, 155.5);
INSERT INTO `user_schema`.`simulation_humans`(`num`, `id`, `isInfected`, `age`, `weight`)
VALUES (3, 3, 1, 87, 112.5);
INSERT INTO `user_schema`.`simulation_humans`(`num`, `id`, `isInfected`, `age`, `weight`)
VALUES (4, 3, 1, 70, 145.5);
INSERT INTO `user_schema`.`simulation_humans`(`num`, `id`, `isInfected`, `age`, `weight`)
VALUES (5, 3, 1, 67, 128.0);

INSERT INTO `user_schema`.`symptom`(`name`) VALUES ('runny nose');
INSERT INTO `user_schema`.`symptom`(`name`) VALUES ('sore throat');
INSERT INTO `user_schema`.`symptom`(`name`) VALUES ('fever');
INSERT INTO `user_schema`.`symptom`(`name`) VALUES ('nausea');
INSERT INTO `user_schema`.`symptom`(`name`) VALUES ('muscle weakness');

INSERT INTO `user_schema`.`showing_symptoms`(`num`, `id`, `name`)VALUES(1, 1, 'sore throat');
INSERT INTO `user_schema`.`showing_symptoms`(`num`, `id`, `name`)VALUES(1, 1, 'fever');
INSERT INTO `user_schema`.`showing_symptoms`(`num`, `id`, `name`)VALUES(1, 1, 'nausea');
INSERT INTO `user_schema`.`showing_symptoms`(`num`, `id`, `name`)VALUES(2, 1, 'muscle weakness');
INSERT INTO `user_schema`.`showing_symptoms`(`num`, `id`, `name`)VALUES(3, 1, 'sore throat');
INSERT INTO `user_schema`.`showing_symptoms`(`num`, `id`, `name`)VALUES(3, 1, 'fever');
INSERT INTO `user_schema`.`showing_symptoms`(`num`, `id`, `name`)VALUES(3, 1, 'nausea');
INSERT INTO `user_schema`.`showing_symptoms`(`num`, `id`, `name`)VALUES(1, 2, 'sore throat');
INSERT INTO `user_schema`.`showing_symptoms`(`num`, `id`, `name`)VALUES(1, 2, 'fever');
INSERT INTO `user_schema`.`showing_symptoms`(`num`, `id`, `name`)VALUES(1, 2, 'nausea');
INSERT INTO `user_schema`.`showing_symptoms`(`num`, `id`, `name`)VALUES(2, 2, 'runny nose');
INSERT INTO `user_schema`.`showing_symptoms`(`num`, `id`, `name`)VALUES(2, 3, 'runny nose');
INSERT INTO `user_schema`.`showing_symptoms`(`num`, `id`, `name`)VALUES(5, 3, 'nausea');
