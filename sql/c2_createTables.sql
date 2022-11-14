CREATE TABLE `user` (
   `username` varchar(30) NOT NULL,
   `password` varchar(30) NOT NULL,
   PRIMARY KEY (`username`),
   UNIQUE KEY `username_UNIQUE` (`username`)
 );

CREATE TABLE `simulation` (
   `id` int NOT NULL AUTO_INCREMENT,
   `sim_name` varchar(30) NOT NULL,
   `creation_time` datetime NOT NULL,
   `completion_time` datetime,
   `last_modified_time` datetime NOT NULL,
   `environment_starting_population` int NOT NULL,
   `environment_isolation_capacity` int NOT NULL,
   `status` varchar(10) NOT NULL DEFAULT 'ongoing',
   `num_deceased` int NOT NULL DEFAULT '0',
   `seed` varchar(30) NOT NULL,
   `funds` int NOT NULL,
   PRIMARY KEY (`id`),
   UNIQUE KEY `id_UNIQUE` (`id`),
   CONSTRAINT CHECK ((status = 'ongoing' AND completion_time IS NULL) OR (status IN ('success', 'fail') AND completion_time IS NOT NULL))
 );
 
 CREATE TABLE `plague` (
	`variant` int NOT NULL,
   `id` int NOT NULL,
	`strength` int NOT NULL,
   `spread_chance` int NOT NULL,
   `spread_radius` int NOT NULL,
   `spread_cooldown` int NOT NULL,
   `mutation_chance` int NOT NULL,
   `curing_threshhold` int NOT NULL,
   `fatality_threshhold` int NOT NULL,
   `death_rate` int NOT NULL,
   `death_cooldown` int NOT NULL,
   PRIMARY KEY(`variant`, `id`),
   CONSTRAINT FOREIGN KEY (`id`) REFERENCES `simulation` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
 );
 
 CREATE TABLE `plague_rules` (
    `num` int NOT NULL AUTO_INCREMENT,
    `variant` int NOT NULL,
    `id` int NOT NULL,
    `category` varchar(30) NOT NULL,
    `range_lower` int,
    `range_upper` int,
    `match_value` int,
    `miss_value` int,
    PRIMARY KEY(`num`, `variant`, `id`),
    CONSTRAINT FOREIGN KEY (`variant`, `id`) REFERENCES `plague` (`variant`, `id`) ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT CHECK (range_lower <= range_upper),
    CONSTRAINT CHECK (category IN ('x', 'y', 'age', 'weight', 'height', 'blood_sugar', 'blood_pressure', 'cholesterol', 'radiation'))
 );

 CREATE TABLE `vaccine_rules` (
   `num` int NOT NULL AUTO_INCREMENT,
   `id` int NOT NULL,
   `category` varchar(30) NOT NULL,
   `range_lower` int,
   `range_upper` int,
   PRIMARY KEY(`num`, `id`),
   CONSTRAINT FOREIGN KEY (`id`) REFERENCES `simulation` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
   CONSTRAINT CHECK (range_lower < range_upper)
 );
 
 CREATE TABLE `simulation_humans` (
   `num` int NOT NULL,
   `id` int NOT NULL,
   `status` varchar(30) NOT NULL default 'alive',
   `age` int NOT NULL,
   `weight` int NOT NULL,
   `height` int NOT NULL,
   `blood_sugar` int NOT NULL,
   `blood_pressure` int NOT NULL,
   `cholesterol` int NOT NULL,
   `radiation` int NOT NULL,
   `x` int NOT NULL,
   `y` int NOT NULL,
   `tax` int NOT NULL,
   `name` varchar(30) NOT NULL,
   `gender` varchar(1) NOT NULL,
   PRIMARY KEY (`num`,`id`),
   KEY `id_idx` (`id`),
   CONSTRAINT `sh_id` FOREIGN KEY (`id`) REFERENCES `simulation` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
   CONSTRAINT CHECK (status IN ('alive', 'isolated', 'dead')),
   CONSTRAINT CHECK (tax >= 0 AND age >= 0 AND weight >= 0 AND height >= 0 AND blood_pressure >= 0 AND blood_sugar >= 0 AND cholesterol >= 0 AND radiation >= 0),
   CONSTRAINT CHECK (gender = 'M' OR gender = 'F')
 );
 
 CREATE TABLE `infection` (
	`human` int NOT NULL,
   `human_id` int NOT NULL,
   `plague` int NOT NULL,
   `plague_id` int NOT NULL,
   PRIMARY KEY(`human`, `human_id`, `plague`),
   CONSTRAINT `h` FOREIGN KEY (`human`, `human_id`) REFERENCES `simulation_humans` (`num`, `id`) ON DELETE CASCADE ON UPDATE RESTRICT,
   CONSTRAINT `p` FOREIGN KEY (`plague`, `plague_id`) REFERENCES `plague` (`variant`, `id`) ON DELETE CASCADE ON UPDATE RESTRICT,
   CONSTRAINT CHECK (human_id = plague_id)
 );

CREATE TABLE `simulation_participation` (
   `username` varchar(30) NOT NULL,
   `id` int NOT NULL,
   `is_owner` tinyint NOT NULL DEFAULT '0',
   PRIMARY KEY (`username`,`id`),
   KEY `f_id_idx` (`id`),
   CONSTRAINT `f_id` FOREIGN KEY (`id`) REFERENCES `simulation` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
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