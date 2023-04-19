//todo: maybe split into loadedSlot and Slot and move to exports?

type itemName = import('../../types').itemName;
type itemDisplayName = import('../../types').itemDisplayName;

/**
 * @see https://oscarnow.github.io/minecraft-server/{version}/classes/Slot
 */
export class Slot {
    /**
     * @package
     */
    constructor(info: {
        id: number, //todo: make explicit
        amount: number,
        nbt: unknown //todo: make known
    });
    /**
     * @package
     */
    readonly id?: number;

    readonly empty: boolean;

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