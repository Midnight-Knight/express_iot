import Default from "@/types/default";

export type typeDoor = boolean | Default;

let door: typeDoor = "unknown";

export function getDoor(): typeDoor
{
    return door;
}

export function setDoor(state: typeDoor)
{
    door = state;
}