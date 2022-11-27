-- vaccinate a human with a vaccine, test if it worked or not
-- returns "cure", "ineffective", or "death" depending on the result

WITH pRules AS
(SELECT * FROM plague_rules
WHERE EXISTS
(SELECT plague, plague_id FROM infection 
WHERE human = (human num) AND human_id = (simulation id) AND plague = variant AND plague_id = id)),
vRules AS
(SELECT * FROM vaccine_rules
WHERE num = (vaccine num) AND id = (simulation id)),
match AS
(SUM(match_value)
FROM vRules, pRules
WHERE vRules.category = pRules.category
AND vRules.range_lower <= pRules.range_lower
AND vRules.range_upper >= pRules.range_upper),
miss AS
(SELECT SUM(miss_value)
FROM vRules, pRules
WHERE vRules.category = pRules.category
AND (vRules.range_lower > pRules.range_lower
OR vRules.range_upper < pRules.range_upper)),
plague AS
(SELECT * FROM plague WHERE variant = (plague variant) AND id = (simulation id)),
SELECT IF(miss > plague.fatality_threshhold, "death", 
SELECT IF(match > plague.curing_threshhold, "cure", "ineffective"));
