class Slot {
    constructor() { }; // todo: see types for implementation

    static stackable() { }; // todo: see types for implementation

    // when at least one of slots is undefined, they're stackable
    static stack() { } // todo: see types for implementation
    static split() { } // todo: see types for implementation
    static moveOne() { } // todo: see types for implementation
};

module.exports = Slot;