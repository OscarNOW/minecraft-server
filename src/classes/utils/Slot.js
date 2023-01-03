class Slot {
    //id could be -1, when Slot is empty
    constructor() { }; // todo: see types for implementation

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