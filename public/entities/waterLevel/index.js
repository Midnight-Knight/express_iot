"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setWaterLevel = exports.getWaterLevel = void 0;
let waterEnough = "unknown";
function getWaterLevel() {
    return waterEnough;
}
exports.getWaterLevel = getWaterLevel;
function setWaterLevel(state) {
    waterEnough = state;
}
exports.setWaterLevel = setWaterLevel;
