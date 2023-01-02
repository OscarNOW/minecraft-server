//todo: implement
//todo: maybe split into loadedSlot and Slot and move to exports?
export class Slot {
    constructor(info: {
        id: number, //todo: make explicit
        amount: number,
        nbt: unknown //todo: make known
    });

    readonly amount: number;
    readonly hasMaxStackSize: boolean;

    static stackable(slot1: Slot, slot2: Slot): boolean;
    static stack(slot1: Slot, slot2: Slot): [Slot, Slot];
}