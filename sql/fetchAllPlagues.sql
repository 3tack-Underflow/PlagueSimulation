-- fetch all plagues
SELECT * FROM plague WHERE id = (simulation id here);

-- fetch all plague rules
SELECT variant, category, range_lower, range_upper, match_value, miss_value FROM plague_rules WHERE variant
WHERE id = (simulation id here);
