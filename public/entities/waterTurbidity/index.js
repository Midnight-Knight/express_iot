"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setWaterTurbidity = exports.getWaterTurbidity = void 0;
let waterEnough = "unknown";
function getWaterTurbidity() {
    return waterEnough;
}
exports.getWaterTurbidity = getWaterTurbidity;
function setWaterTurbidity(state) {
    waterEnough = state;
}
exports.setWaterTurbidity = setWaterTurbidity;
