import { stageWidth, stageHeight } from "./Constants.js"

const sign = (p1, p2, p3) => {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

// pt is the point, v1 v2 v3 are triangle points
const PointInTriangle = (pt, v1, v2, v3) => {
    var d1, d2, d3;
    var has_neg, has_pos;

    d1 = sign(pt, v1, v2);
    d2 = sign(pt, v2, v3);
    d3 = sign(pt, v3, v1);

    has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

    return !(has_neg && has_pos);
}

const ElevationRange = (x, y) => {
    var pt = {x: x, y: y}
    var pt1 = {x: -stageWidth / 2, y: -stageHeight / 2};
    var pt2 = {x: -stageWidth / 2 + stageWidth / 4, y: -stageHeight / 2};
    var pt3 = {x: -stageWidth / 2, y: stageHeight / 2};

    var pt4 = {x: stageWidth / 2, y:-stageHeight / 2};
    var pt5 = {x: stageWidth / 2, y: stageHeight / 2};
    var pt6 = {x: stageWidth / 2 - stageWidth / 4, y: stageHeight / 2};

    var pt7 = {x: -stageWidth / 2 + stageWidth / 4 * 2, y: -stageHeight / 2};
    var pt8 = {x: -stageWidth / 2 + stageWidth / 4 * 3, y: -stageHeight / 2};
    var pt9 = {x: -stageWidth / 2 + stageWidth / 4 * 2, y: stageHeight / 2};

    var pt10 = {x: -stageWidth / 2 + stageWidth / 4 * 2, y: -stageHeight / 2};
    var pt11 = {x: -stageWidth / 2 + stageWidth / 4 * 2, y: stageHeight / 2};
    var pt12 = {x: -stageWidth / 2 + stageWidth / 4, y: stageHeight / 2};

    if (PointInTriangle(pt, pt1, pt2, pt3) || PointInTriangle(pt, pt4, pt5, pt6)) {
        return 1;
    } else if (PointInTriangle(pt, pt7, pt8, pt9) || PointInTriangle(pt, pt10, pt11, pt12)) {
        return 3;
    } else {
        return 2;
    }
}

const TemperatureRange = (y) => {
    for (var i = 1; i <= 6; ++i) {
        if (y <= -stageHeight / 2 + stageHeight / 6 * i) {
            return i;
        }
    }
}

const HumidityRange = (x) => {
    for (var i = 1; i <= 8; ++i) {
        if (x <= -stageWidth / 2 + stageWidth / 8 * i) {
            return i;
        }
    }
}

const AgeRange = (age) => {
    if (age <= 30) {
        return 1;
    } else if (age <= 45) {
        return 2;
    } else {
        return 3;
    }
}

const WeightRange = (weight) => {
    if (weight <= 135) {
        return 1;
    } else if (weight <= 180) {
        return 2;
    } else {
        return 3;
    }
}

const HeightRange = (height) => {
    if (height <= 165) {
        return 1;
    } else if (height <= 185) {
        return 2;
    } else {
        return 3;
    }
}

const BloodPressureRange = (bloodPressure) => {
    if (bloodPressure <= 95) {
        return 1;
    } else if (bloodPressure <= 120) {
        return 2
    } else {
        return 3
    }
}

const CholesterolRange = (cholesterol) => {
    if (cholesterol <= 130) {
        return 1;
    } else if (cholesterol <= 210) {
        return 2;
    } else {
        return 3;
    }
}

var Distance = (x1, y1, x2, y2) => {
    return (Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))).toFixed(0);
}

const MatchRule = (human, rule) => {
    var val;
    if (rule[2] === "tempertaure") {
        val = TemperatureRange(human[12]);
    } else if (rule[2] === "humidity") {
        val = HumidityRange(human[11]);
    } else if (rule[2] === "elevation") {
        val = ElevationRange(human[11], human[12]);
    } else if (rule[2] === "age") {
        val = human[4];
    } else if (rule[2] === "weight") {
        val = human[5];
    } else if (rule[2] === "height") {
        val = human[6];
    } else if (rule[2] === "blood_type") {
        val = human[7];
    } else if (rule[2] === "blood_pressure") {
        val = human[8];
    } else if (rule[2] === "cholesterol") {
        val = human[9];
    } else if (rule[2] === "radiation") {
        val = human[10];
    }
    return val >= rule[3] && val <= rule[4];
}

const GetRuleCandidates = (patient0, humans, minCount, radius) => {
    var ruleCandidates = {
        tempMinus: 0, 
        tempPlus: 0, 
        humidMinus: 0, 
        humidPlus: 0,
        elevation: 0, 
        age: 0,
        weight: 0,
        height: 0,
        blood_type: 0,
        blood_pressure: 0,
        cholesterol: 0,
        radiation: 0
    };

    // index 0 is ignored because it is patient 0
    for (var i = 1; i < humans.length; ++i) {
        var human = humans[i].val;
        if (Distance(human[11], human[12], patient0[11], patient0[12]) > radius) {
            continue;
        }
        if (TemperatureRange(human[12]) >= TemperatureRange(patient0[12]) && 
            TemperatureRange(human[12]) <= TemperatureRange(patient0[12]) + 1) {
                ruleCandidates.tempPlus++;
        } 
        if (TemperatureRange(human[12]) >= TemperatureRange(patient0[12]) - 1 && 
            TemperatureRange(human[12]) <= TemperatureRange(patient0[12])) {
                ruleCandidates.tempMinus++;
        } 
        if (HumidityRange(human[11]) >= HumidityRange(patient0[11]) && 
            HumidityRange(human[11]) <= HumidityRange(patient0[11]) + 1) {
                ruleCandidates.humidPlus++;
        } 
        if (HumidityRange(human[11]) >= HumidityRange(patient0[11]) - 1 && 
            HumidityRange(human[11]) <= HumidityRange(patient0[11])) {
                ruleCandidates.humidMinus++;
        } 
        if (ElevationRange(human[11], human[12]) == ElevationRange(patient0[11], patient0[12])) {
            ruleCandidates.elevation++;
        } 
        if (AgeRange(human[4]) == AgeRange(patient0[4])) {
            ruleCandidates.age++;
        } 
        if (WeightRange(human[5]) == WeightRange(patient0[5])) {
            ruleCandidates.weight++;
        } 
        if (HeightRange(human[6]) == HeightRange(patient0[6])) {
            ruleCandidates.height++;
        } 
        if (human[7] == patient0[7]) {
            ruleCandidates.blood_type++;
        } 
        if (BloodPressureRange(human[8]) == BloodPressureRange(patient0[8])) {
            ruleCandidates.blood_pressure++;
        } 
        if (CholesterolRange(human[9]) == CholesterolRange(patient0[9])) {
            ruleCandidates.cholesterol++;
        }
        if (human[10] >= 7400 && patient0.radiation >= 7400 && human[10] >= patient0.radiation - 250) {
            ruleCandidates.radiation++;
        }
    }

    console.log(ruleCandidates);
    var validRules = [];
    if (ruleCandidates.tempMinus > minCount) validRules.push("temperature_M");
    if (ruleCandidates.tempPlus > minCount) validRules.push("temperature_P");
    if (ruleCandidates.humidMinus > minCount) validRules.push("humidity_M");
    if (ruleCandidates.humidPlus > minCount) validRules.push("humidity_P");
    if (ruleCandidates.elevation > minCount) validRules.push("elevation");
    if (ruleCandidates.age > minCount) validRules.push("age");
    if (ruleCandidates.weight > minCount) validRules.push("weight");
    if (ruleCandidates.height > minCount) validRules.push("height");
    if (ruleCandidates.blood_type > minCount) validRules.push("blood_type");
    if (ruleCandidates.blood_pressure > minCount) validRules.push("blood_pressure");
    if (ruleCandidates.cholesterol > minCount) validRules.push("cholesterol");
    if (ruleCandidates.radiation > minCount) validRules.push("radiation");

    return validRules;
}

const MatchAllRules = (human, rules) => {
    for (var i = 0; i < rules.length; ++i) {
        if (!MatchRule(human, rules[i])) {
            return false;
        }
    }
    return true;
}

export { ElevationRange, TemperatureRange, HumidityRange, Distance, MatchRule, MatchAllRules, GetRuleCandidates };