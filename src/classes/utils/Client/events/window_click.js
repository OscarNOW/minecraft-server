const Slot = require('../../Slot.js');
const { inventory } = require('../properties/public/dynamic/inventory.js');

const cursorSlotId = -1; //todo: move to data file

// https://minecraft.fandom.com/wiki/Inventory#Managing_inventory

module.exports = {
    window_click({ windowId, slot: clickedSlotId, mouseButton, mode }) {
        // todo: implement confirmation (with action)
        // todo: only works for clicks in inventory when only inventory is open

        if (windowId === 0) { // inventory
            const clickedSlot = inventory.getSlot.call(this, clickedSlotId);

            const cursorSlot = inventory.getSlot.call(this, cursorSlotId);
            const stackable = Slot.stackable(clickedSlot, cursorSlot);

            if (mode === 0) { // normal click
                if (mouseButton === 0) { // left mouse click
                    if (stackable) { // stack both slots
                        const { stack, rest } = Slot.stack(clickedSlot, cursorSlot);
                        inventory.setSlot.call(this, cursorSlotId, stack);
                        inventory.setSlot.call(this, clickedSlotId, rest);
                    } else { // swap slots
                        let oldCursorSlot = cursorSlot;
                        inventory.setSlot.call(this, cursorSlotId, clickedSlot);
                        inventory.setSlot.call(this, clickedSlotId, oldCursorSlot);
                    }
                } else if (mouseButton === 1) { // right mouse click
                    if (stackable) {
                        if (cursorSlot === undefined) { // move half of clicked slot to cursor slot
                            const { bigger, smaller } = Slot.split(clickedSlot);
                            inventory.setSlot.call(this, cursorSlotId, smaller);
                            inventory.setSlot.call(this, clickedSlotId, bigger);
                        } else { // drop one from cursor slot to clicked slot
                            const { slot1: newCursorSlot, slot2: newClickedSlot } = Slot.dropOne(cursorSlot, clickedSlot);
                            inventory.setSlot.call(this, cursorSlotId, newCursorSlot);
                            inventory.setSlot.call(this, clickedSlotId, newClickedSlot);
                        }
                    } else { // swap slots, same as left click
                        let oldCursorSlot = cursorSlot;
                        inventory.setSlot.call(this, cursorSlotId, clickedSlot);
                        inventory.setSlot.call(this, clickedSlotId, oldCursorSlot);
                    }
                }
            } else if (mode === 1) { // shift click
                if (mouseButton === 0 || mouseButton === 1) { // left click and right click have same behavior

                }
            }
        }
        // else
        // not implemented
    }
}