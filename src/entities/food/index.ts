import Default from "@/types/default";

export type typeFood = number | Default;

let kg: typeFood = "unknown";
const h: number = 17.1;
const d: number = 7.5;
const V: number = (h * Math.PI * Math.pow(d,2)) / 4;

export function getKg(): typeFood {
    return typeof(kg) === "number" ? (Number((((kg * Math.PI * Math.pow(d,2)) / 4) / 1000).toFixed(3)) < Number((V / 1000).toFixed(3)) ? Number((((kg * Math.PI * Math.pow(d,2)) / 4) / 1000).toFixed(3)) : Number((V / 1000).toFixed(3))) : kg;
}

export function setKg(cm: typeFood){
    kg = cm;
}

export function getFullKg(): number {
    return Number((V / 1000).toFixed(3));
}
