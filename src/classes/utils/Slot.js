const { items } = require('../../functions/loader/data.js');

class Slot {
    // constructor({ id, amount, nbt }) {
    constructor({ id, amount }) {
        if (id === -1 || amount === 0)
            this.empty = true;
        else
            this.empty = false;

        if (!this.empty) {
            this.id = id;
            this.amount = amount;

            let itemInfo = items.find(item => item[0] === this.id);

            this.name = itemInfo[2];
            this.displayName = itemInfo[1];
            this.maxStackSize = itemInfo[3];
        };
    };

    static newEmpty() {
        return new Slot({ amount: 0 });
    };

    static stackable(slot1, slot2) {
        if (slot1.empty || slot2.empty)
            return true;

        if (slot1.id === slot2.id)
            return true;

        return false;
    };

    // return new Slots, do not modify original
    static stack(from, to) {
        if (!Slot.stackable(from, to))
            return [from, to];

        const itemsAvailableOnStack = to.maxStackSize - to.amount;
        let moveAmount;
        if (from.amount < itemsAvailableOnStack)
            moveAmount = from.amount;
        else
            moveAmount = itemsAvailableOnStack;

        const { from: newFrom, to: newTo } = move(from, to, moveAmount);
        return { stack: newTo, rest: newFrom };

    };

    // return new Slot, do not modify original
    // when Slot is undefined, use newEmpty
    static split() { }; // todo: see types for implementation

    // return new Slots, do not modify original
    // use move function
    static moveOne(from, to) {
        if (!Slot.stackable(from, to))
            return [from, to];

        const { from: newFrom, to: newTo } = move(from, to, 1);
        return { from: newFrom, to: newTo };
    };
};

// move amount from from to to, return new Slots without modifying originals
function move(from, to, amount) {
    if (from.amount < amount)
        throw new Error('Trying to move more items than available.') // todo: emit CustomError

    const newFrom = new Slot({ id: from.id, amount: from.amount - amount });
    const newTo = new Slot({ id: to.id, amount: to.amount + amount });

    return { from: newFrom, to: newTo };
}

module.exports = Slot;