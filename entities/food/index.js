"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullKg = exports.setKg = exports.getKg = void 0;
let kg = "unknown";
const h = 17.1;
const d = 7.5;
const V = (h * Math.PI * Math.pow(d, 2)) / 4;
function getKg() {
    return typeof (kg) === "number" ? (Number((((kg * Math.PI * Math.pow(d, 2)) / 4) / 1000).toFixed(3)) < Number((V / 1000).toFixed(3)) ? Number((((kg * Math.PI * Math.pow(d, 2)) / 4) / 1000).toFixed(3)) : Number((V / 1000).toFixed(3))) : kg;
}
exports.getKg = getKg;
function setKg(cm) {
    kg = cm;
}
exports.setKg = setKg;
function getFullKg() {
    return Number((V / 1000).toFixed(3));
}
exports.getFullKg = getFullKg;
