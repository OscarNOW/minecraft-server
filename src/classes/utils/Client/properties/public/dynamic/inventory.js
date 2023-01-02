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
                slots: {
                    ...Object.fromEntries(Array(27).fill(0).map((_, i) => [i, undefined]))
                }
            };
        },
        setSlot(id, slot) {
            //todo: use set function
            //todo: make work with Object.freeze
            //todo: create separate map function
            //todo: create changed set
            if (id >= 0 && id <= 4) // 2x2 crafting
                if (id === 0)
                    this.p._inventory.crafting.output = slot;
                else
                    this.p._inventory.crafting.slots[id - 1] = slot;
            else if (id >= 5 && id <= 8) { // armor
                if (id === 5)
                    this.p._inventory.armor.helmet = slot;
                else if (id === 6)
                    this.p._inventory.armor.chestplate = slot;
                else if (id === 7)
                    this.p._inventory.armor.leggings = slot;
                else if (id === 8)
                    this.p._inventory.armor.boots = slot;
            } else if (id >= 9 && id <= 35) // slots
                this.p._inventory.slots[id - 9] = slot;
            else if (id >= 36 && id <= 44) // hotbar
                this.p._inventory.hotbar[id - 36] = slot;
            else if (id === 45) // offhand
                this.p._inventory.offhand = slot;
        }
    }
}