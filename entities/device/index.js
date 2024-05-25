"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDevice = void 0;
function getDevice() {
    const date = new Date();
    return {
        title: "Прототип кормушки v0.1",
        owner: "Деев Л.Р.",
        date: date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear(),
        time: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
        pet: "Лайка - Вольт"
    };
}
exports.getDevice = getDevice;
