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

export { ElevationRange, TemperatureRange, HumidityRange };