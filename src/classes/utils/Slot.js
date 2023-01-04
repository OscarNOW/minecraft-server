const { items } = require('../../functions/loader/data.js');

class Slot {
    //id could be -1, when Slot is empty
    // constructor({ id, amount, nbt }) {
    constructor({ id, amount }) {
        this.id = id;
        this.amount = amount;

        let itemInfo = items.find(item => item[0] === this.id);

        this.name = itemInfo[2];
        this.displayName = itemInfo[1];
        this.maxStackSize = itemInfo[3];
    };

    // create new Slot each time
    static newEmpty() { }; // todo: see types for implementation

    // when at least one of slots is undefined, they're stackable
    static stackable() { }; // todo: see types for implementation

    // return new Slots, do not modify original
    // when at least one is undefined, use newEmpty
    static stack() { }; // todo: see types for implementation

    // return new Slot, do not modify original
    // when Slot is undefined, use newEmpty
    static split() { }; // todo: see types for implementation

    // return new Slots, do not modify original
    // when at least one is undefined, use newEmpty
    static moveOne() { }; // todo: see types for implementation
};

module.exports = Slot;