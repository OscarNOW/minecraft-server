//todo: maybe split into loadedSlot and Slot and move to exports?
export class Slot {
    private constructor(info: {
        id: number, //todo: make explicit
        amount: number,
        nbt: unknown //todo: make known
    });

    private readonly id: number;

    readonly amount: number;
    readonly name: itemName;
    readonly maxStackSize: boolean;
    readonly displayName: itemDisplayName;

    static newEmpty(): Slot;
    static stackable(slot1: Slot, slot2: Slot): boolean;

    static stack(slot1: Slot, slot2: Slot): { stack: Slot, rest: Slot };
    static split(slot: Slot): { bigger: Slot, smaller: Slot };
    static moveOne(slot1: Slot, slot2: Slot): { slot1: Slot, slot2: Slot }; // todo: make return type array?
}