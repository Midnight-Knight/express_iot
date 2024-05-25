import Default from "@/types/default";

export type deviceType = {title: "Прототип кормушки v0.1", owner: string, date: string, time: string, pet: string} | Default;

export function getDevice(): deviceType
{
    const date = new Date();
    return {
        title: "Прототип кормушки v0.1",
        owner: "Деев Л.Р.",
        date: date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear(),
        time: date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
        pet: "Лайка - Вольт"
    };
}