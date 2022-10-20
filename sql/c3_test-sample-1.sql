-- TEST FOR FEATURE 1, LOGIN --

-- initial select all --
SELECT * FROM user;

-- 1) Register a new account, for example username = mark and password = iLAk5L? --
INSERT INTO `user`(`username`,`password`) VALUES ('mark', 'iLAk5L?');

-- select all after query 1 --
SELECT * FROM user;

-- 2) Register a new account where the username is taken, for example username = grace and password = dimaL8! --
INSERT INTO `user`(`username`,`password`) VALUES ('grace', 'dimaL8!');

-- select all after query 2 --
SELECT * FROM user;

-- 3) Login to account - return true if username and password match, for example username = grace and password = JTECKk1! --
SELECT IF(EXISTS (SELECT * FROM user WHERE username = 'grace' AND password = 'JTECKk1!'), true, false);

-- 4) Login to account with wrong username and/or password, should return false, for example username = grace and password = ijk --
SELECT IF(EXISTS (SELECT * FROM user WHERE username = 'grace' AND password = 'ijk'), true, false);