CREATE TABLE `user` (
   `username` varchar(30) NOT NULL,
   `password` varchar(30) NOT NULL,
   PRIMARY KEY (`username`),
   UNIQUE KEY `username_UNIQUE` (`username`)
 );

CREATE TABLE `simulation` (
   `id` int NOT NULL AUTO_INCREMENT,
   `disease_name` varchar(30) NOT NULL,
   `settings_severity` int NOT NULL,
   `settings_max_rules` int NOT NULL,
   `environment_total_population` int NOT NULL,
   `environment_isolation_capacity` int NOT NULL,
   `disease_spread_rate` int NOT NULL,
   `disease_spread_radius` int NOT NULL,
   `disease_mutation_time` int NOT NULL,
   `funds` int NOT NULL,
   PRIMARY KEY (`id`),
   UNIQUE KEY `id_UNIQUE` (`id`)
 );
 
 CREATE TABLE `simulation_humans` (
   `num` int NOT NULL,
   `id` int NOT NULL,
   `is_infected` tinyint NOT NULL DEFAULT '0',
   `age` int NOT NULL,
   `weight` float NOT NULL,
   PRIMARY KEY (`num`,`id`),
   KEY `id_idx` (`id`),
   CONSTRAINT `sh_id` FOREIGN KEY (`id`) REFERENCES `simulation` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
 );

CREATE TABLE `simulation_participation` (
   `username` varchar(30) NOT NULL,
   `id` int NOT NULL,
   `is_owner` tinyint NOT NULL DEFAULT '0',
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
   `start_time` int NOT NULL,
   PRIMARY KEY (`num`,`id`, `name`),
   KEY `name_idx` (`name`),
   KEY `id_idx` (`id`),
   CONSTRAINT `name` FOREIGN KEY (`name`) REFERENCES `symptom` (`name`) ON DELETE CASCADE ON UPDATE RESTRICT,
   CONSTRAINT `num, id` FOREIGN KEY (`num`, `id`) REFERENCES `simulation_humans` (`num`, `id`) ON DELETE CASCADE ON UPDATE RESTRICT
 )