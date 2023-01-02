class Slot {
    //id could be -1, when Slot is empty
    constructor() { }; // todo: see types for implementation

    static stackable() { }; // todo: see types for implementation

    // when at least one of slots is undefined, they're stackable
    static stack() { } // todo: see types for implementation
    static split() { } // todo: see types for implementation
    static moveOne() { } // todo: see types for implementation
};

module.exports = Slot;