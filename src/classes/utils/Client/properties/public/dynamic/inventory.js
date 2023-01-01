module.exports = {
    inventory: {
        info: {
            preventSet: true
        },
        get() {
            return this.p._inventory;
        },
        set(newValue) {
            this.p._inventory = newValue;
        },
        init() {
            this.p._inventory = { //todo: Object.freeze
                armor: {
                    helmet: undefined,
                    chestplate: undefined,
                    leggings: undefined,
                    boots: undefined
                },
                offhand: undefined,
                crafting: {
                    output: undefined,
                    slots: {
                        0: undefined,
                        1: undefined,
                        2: undefined,
                        3: undefined
                    }
                },
                hotbar: {
                    0: undefined,
                    1: undefined,
                    2: undefined,
                    3: undefined,
                    4: undefined,
                    5: undefined,
                    6: undefined,
                    7: undefined,
                    8: undefined
                },
                slots: {}
            };
        }
    }
}