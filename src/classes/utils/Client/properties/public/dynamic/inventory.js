const Slot = require('../../../../Slot.js');

module.exports = {
    inventory: {
        info: {
            preventSet: true
        },
        get() {
            return this.p._inventory;
        },
        set(newValue, beforeReady) {
            const oldValue = this.p._inventory;

            this.p._inventory = newValue;

            if (!beforeReady && oldValue !== newValue)
                this.p.emitChange('inventory', oldValue);
        },
        init() {
            this.p._inventory = { //todo: Object.freeze
                cursor: Slot.newEmpty(),
                armor: {
                    helmet: Slot.newEmpty(),
                    chestplate: Slot.newEmpty(),
                    leggings: Slot.newEmpty(),
                    boots: Slot.newEmpty()
                },
                offhand: Slot.newEmpty(),
                crafting: {
                    output: Slot.newEmpty(),
                    slots: {
                        0: Slot.newEmpty(),
                        1: Slot.newEmpty(),
                        2: Slot.newEmpty(),
                        3: Slot.newEmpty()
                    }
                },
                hotbar: {
                    0: Slot.newEmpty(),
                    1: Slot.newEmpty(),
                    2: Slot.newEmpty(),
                    3: Slot.newEmpty(),
                    4: Slot.newEmpty(),
                    5: Slot.newEmpty(),
                    6: Slot.newEmpty(),
                    7: Slot.newEmpty(),
                    8: Slot.newEmpty()
                },
                slots: {
                    ...Object.fromEntries(Array(27).fill(0).map((_, i) => [i, Slot.newEmpty()]))
                }
            };
        },
        setSlot(id, slot) {
            //todo: use set function
            //todo: make work with Object.freeze
            //todo: create separate map function
            //todo: create changed set

            // todo: set oldValue to copy of inventory, because when inventory is modified below, it also modifies oldValue, so oldValue isn't the old value anymore

            if (id === -1) // cursor
                this.p._inventory.cursor = slot;
            else if (id >= 0 && id <= 4) // 2x2 crafting
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

            // if(!beforeReady) // todo: check if ready
            this.p.emitChange('inventory', this.p._inventory); // todo: use oldValue, see above
        },
        getSlot(id) {
            //todo: see setSlot
            if (id === -1) // cursor
                return this.p._inventory.cursor;
            else if (id >= 0 && id <= 4) // 2x2 crafting
                if (id === 0)
                    return this.p._inventory.crafting.output;
                else
                    return this.p._inventory.crafting.slots[id - 1];
            else if (id >= 5 && id <= 8) { // armor
                if (id === 5)
                    return this.p._inventory.armor.helmet;
                else if (id === 6)
                    return this.p._inventory.armor.chestplate;
                else if (id === 7)
                    return this.p._inventory.armor.leggings;
                else if (id === 8)
                    return this.p._inventory.armor.boots;
            } else if (id >= 9 && id <= 35) // slots
                return this.p._inventory.slots[id - 9];
            else if (id >= 36 && id <= 44) // hotbar
                return this.p._inventory.hotbar[id - 36];
            else if (id === 45) // offhand
                return this.p._inventory.offhand;
        }
    }
}