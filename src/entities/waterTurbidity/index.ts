import Default from "@/types/default";

export type typeWaterTurbidity = number | Default;

let waterEnough: typeWaterTurbidity = "unknown";

export function getWaterTurbidity(): typeWaterTurbidity {
    return typeof(waterEnough) === "number" ? (100 - Math.round(waterEnough / 40.95)) : waterEnough;
}

export function setWaterTurbidity(state: typeWaterTurbidity){
    waterEnough = state;
}