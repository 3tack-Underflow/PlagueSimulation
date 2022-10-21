-- TEST FOR FEATURE 2, LOGIN --

-- 1) Login to account - return true if username and password match, for example username = grace and password = JTECKk1! --
SELECT IF(EXISTS (SELECT * FROM user WHERE username = 'grace' AND password = 'JTECKk1!'), true, false);

-- 2) Login to account with wrong username and/or password, should return false, for example username = grace and password = ijk --
SELECT IF(EXISTS (SELECT * FROM user WHERE username = 'grace' AND password = 'ijk'), true, false);