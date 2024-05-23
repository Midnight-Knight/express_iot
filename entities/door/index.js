"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDoor = exports.getDoor = void 0;
let door = "unknown";
function getDoor() {
    return door;
}
exports.getDoor = getDoor;
function setDoor(state) {
    door = state;
}
exports.setDoor = setDoor;
