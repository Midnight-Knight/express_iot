"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setWaterTurbidity = exports.getWaterTurbidity = void 0;
let waterEnough = "unknown";
function getWaterTurbidity() {
    return typeof (waterEnough) === "number" ? Math.round(waterEnough / 40.95) : waterEnough;
}
exports.getWaterTurbidity = getWaterTurbidity;
function setWaterTurbidity(state) {
    waterEnough = state;
}
exports.setWaterTurbidity = setWaterTurbidity;
