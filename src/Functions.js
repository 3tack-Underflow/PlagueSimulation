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

var Distance = (x1, y1, x2, y2) => {
    return (Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))).toFixed(0);
}

/*
var simHuman = {
                val: [i + 1, // id 0
                simID, // simID 1
                "alive", // status 2
                0, // isolated 3
                age, // age 4
                weight, // weight 5
                randomNumberInRange(80, 220), //height 6
                bloodTypes[randomNumberInRange(0, 2)], // blood type 7
                bloodPressure, // blood pressure 8
                cholesterol, // cholesterol 9
                radiation, // radiation 10
                gridGap - stageW/2 + positions[i][0] * gridGap - 8 + randomNumberInRange(0, 16), // x 11
                gridGap - stageH/2 + positions[i][1] * gridGap - 8 + randomNumberInRange(0, 16), // y 12
                randomNumberInRange(0, donationRate * 2), // tax 13
                null, // mark 14
                curName, // name 15
                curGender], // gender 16
                x: positions[i][0], y: positions[i][1]}; 
                */

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

const MatchAllRules = (human, rules) => {
    for (var i = 0; i < rules.length; ++i) {
        if (!MatchRule(human, rules[i])) {
            return false;
        }
    }
    return true;
}

export { ElevationRange, TemperatureRange, HumidityRange, Distance, MatchRule, MatchAllRules };