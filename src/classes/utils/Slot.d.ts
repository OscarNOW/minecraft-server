//todo: maybe split into loadedSlot and Slot and move to exports?
export class Slot {
    private constructor(info: {
        id: number, //todo: make explicit
        amount: number,
        nbt: unknown //todo: make known
    });

    readonly empty: boolean;

    private readonly id?: number;

    readonly amount?: number;
    readonly name?: itemName;
    readonly maxStackSize?: number;
    readonly displayName?: itemDisplayName;

    static newEmpty(): Slot;
    static stackable(slot1: Slot, slot2: Slot): boolean;

    static stack(from: Slot, to: Slot): { stack: Slot, rest: Slot };
    static split(slot: Slot): { bigger: Slot, smaller: Slot };
    static moveOne(from: Slot, to: Slot): { from: Slot, to: Slot }; //todo: make generalized method for any amount
}