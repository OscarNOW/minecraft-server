const Slot = require('../../Slot.js');
const { inventory } = require('../properties/public/dynamic/inventory.js');

module.exports = {
    set_creative_slot({ slot, item: { present, itemId, itemCount, nbtData } }) {
        if (present)
            inventory.setSlot.call(this, slot, new Slot({ id: itemId, amount: itemCount, nbt: nbtData }));
        else
            inventory.setSlot.call(this, slot, undefined);
    }
}