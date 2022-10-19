CREATE TABLE `user` (
   `username` varchar(20) NOT NULL,
   `password` varchar(45) NOT NULL,
   PRIMARY KEY (`username`),
   UNIQUE KEY `username_UNIQUE` (`username`)
 );

CREATE TABLE `simulation` (
   `id` int NOT NULL AUTO_INCREMENT,
   `settings_difficulty` int NOT NULL,
   `environment_startingPop` int NOT NULL,
   `environment_virusSpreadRate` int NOT NULL,
   `environment_virusSpreadTemp` int NOT NULL,
   PRIMARY KEY (`id`),
   UNIQUE KEY `id_UNIQUE` (`id`)
 );
 
 CREATE TABLE `simulationhumans` (
   `num` int NOT NULL AUTO_INCREMENT,
   `id` int NOT NULL,
   `isInfected` tinyint NOT NULL DEFAULT '0',
   `age` int NOT NULL,
   `weight` float NOT NULL,
   PRIMARY KEY (`num`,`id`),
   UNIQUE KEY `num_UNIQUE` (`num`),
   KEY `id_idx` (`id`),
   CONSTRAINT `id` FOREIGN KEY (`id`) REFERENCES `simulation` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
 );

CREATE TABLE `simulationparticipation` (
   `username` varchar(20) NOT NULL,
   `id` int NOT NULL,
   `isOwner` tinyint NOT NULL DEFAULT '0',
   PRIMARY KEY (`username`,`id`),
   KEY `f_id_idx` (`id`),
   CONSTRAINT `f_id` FOREIGN KEY (`id`) REFERENCES `simulation` (`id`),
   CONSTRAINT `f_user` FOREIGN KEY (`username`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE RESTRICT
 );

CREATE TABLE `shows` (
   `num` int NOT NULL,
   `name` varchar(45) NOT NULL,
   PRIMARY KEY (`num`,`name`),
   KEY `name_idx` (`name`),
   CONSTRAINT `name` FOREIGN KEY (`name`) REFERENCES `symptom` (`name`) ON DELETE CASCADE ON UPDATE RESTRICT,
   CONSTRAINT `num` FOREIGN KEY (`num`) REFERENCES `simulationhumans` (`num`) ON DELETE CASCADE ON UPDATE RESTRICT
 );
 
 CREATE TABLE `symptom` (
   `name` varchar(45) NOT NULL,
   PRIMARY KEY (`name`),
   UNIQUE KEY `name_UNIQUE` (`name`)
 );