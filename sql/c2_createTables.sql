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
   `environment_virusSpreadTemp` float NOT NULL,
   PRIMARY KEY (`id`),
   UNIQUE KEY `id_UNIQUE` (`id`)
 );
 
 CREATE TABLE `simulation_humans` (
   `num` int NOT NULL,
   `id` int NOT NULL,
   `isInfected` tinyint NOT NULL DEFAULT '0',
   `age` int NOT NULL,
   `weight` float NOT NULL,
   PRIMARY KEY (`num`,`id`),
   KEY `id_idx` (`id`),
   CONSTRAINT `id` FOREIGN KEY (`id`) REFERENCES `simulation` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
 );

CREATE TABLE `simulation_participation` (
   `username` varchar(20) NOT NULL,
   `id` int NOT NULL,
   `isOwner` tinyint NOT NULL DEFAULT '0',
   PRIMARY KEY (`username`,`id`),
   KEY `f_id_idx` (`id`),
   CONSTRAINT `f_id` FOREIGN KEY (`id`) REFERENCES `simulation` (`id`),
   CONSTRAINT `f_user` FOREIGN KEY (`username`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE RESTRICT
 );
 
  CREATE TABLE `symptom` (
   `name` varchar(45) NOT NULL,
   PRIMARY KEY (`name`),
   UNIQUE KEY `name_UNIQUE` (`name`)
 );

CREATE TABLE `showing_symptoms` (
   `num` int NOT NULL,
   `id` int NOT NULL,
   `name` varchar(45) NOT NULL,
   PRIMARY KEY (`num`,`id`, `name`),
   KEY `name_idx` (`name`),
   KEY `id_idx` (`id`),
   CONSTRAINT `name` FOREIGN KEY (`name`) REFERENCES `symptom` (`name`) ON DELETE CASCADE ON UPDATE RESTRICT,
   CONSTRAINT `num, id` FOREIGN KEY (`num`, `id`) REFERENCES `simulation_humans` (`num`, `id`) ON DELETE CASCADE ON UPDATE RESTRICT
 )