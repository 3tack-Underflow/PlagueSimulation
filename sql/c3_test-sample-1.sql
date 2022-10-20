-- TEST FOR FEATURE 1, LOGIN/REGISTER --

-- initial select all --
SELECT * FROM user_schema.user;

-- 2) attempt login with correct password --
SELECT EXISTS(
SELECT *
FROM user_schema.user
WHERE username = "april" AND password = "eYatdX"
);

-- 3) attempt login with incorrect password --
SELECT EXISTS(
SELECT *
FROM user_schema.user
WHERE username = "april" AND password = "thewrongpassword"
);

-- 4) Register user with a unique username
INSERT INTO `user_schema`.`user`(`username`, `password`)
SELECT 'Lebron', 'Lebron321'
WHERE (SELECT COUNT(username) FROM user_schema.user WHERE username = 'Lebron') = 0;

-- 5) Register user with an existing username (don't register)
INSERT INTO `user_schema`.`user`(`username`, `password`)
SELECT 'april', 'Lebron321'
WHERE (SELECT COUNT(username) FROM user_schema.user WHERE username = 'april') = 0;
