-- vaccinate a human with a vaccine

WITH pRules AS
(SELECT * FROM plague_rules
WHERE EXISTS
(SELECT plague, plague_id FROM infection 
WHERE human = (human num) AND human_id = (simulation id) AND plague = variant AND plague_id = id)),
vRules AS
(SELECT * FROM vaccine_rules
WHERE num = (vaccine num) AND id = (simulation id))
SELECT (SELECT SUM(match_value)
FROM vRules, pRules
WHERE vRules.category = pRules.category
AND vRules.range_lower <= pRules.range_lower
AND vRules.range_upper >= pRules.range_upper) - 
(SELECT SUM(match_value)
FROM vRules, pRules
WHERE vRules.category = pRules.category
AND (vRules.range_lower > pRules.range_lower
OR vRules.range_upper < pRules.range_upper));
