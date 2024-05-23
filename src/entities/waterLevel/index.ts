import Default from "@/types/default";

export type typeWaterLevel = boolean | Default;

let waterEnough: typeWaterLevel = "unknown";

export function getWaterLevel(): typeWaterLevel {
    return waterEnough;
}

export function setWaterLevel(state: typeWaterLevel){
    waterEnough = state;
}