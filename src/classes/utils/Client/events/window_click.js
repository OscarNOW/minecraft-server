const Slot = require('../../Slot.js');
const { inventory } = require('../properties/public/dynamic/inventory.js');

const cursorSlotId = -1; //todo: move to data file

// https://minecraft.fandom.com/wiki/Inventory#Managing_inventory

module.exports = {
    // window_click({ windowId, slot: clickedSlotId, mouseButton, mode, item: claimedClickedSlot }) {
    window_click({ windowId, slot: clickedSlotId, mouseButton, mode }) {
        // todo: implement confirmation (with action)
        // todo: check if claimedClickedSlot is same as clickedSlot and throw error if not
        // todo:    sometimes claimedClickedSlot is empty, but clickedSlot is not
        // todo: only works for clicks in inventory when only inventory is open
        // todo: emit events when certain things happen (like clicking on a slot or outside window)

        if (windowId === 0) { // inventory
            const clickedSlot = clickedSlotId === -999 ?
                null :
                inventory.getSlot.call(this, clickedSlotId);

            const cursorSlot = inventory.getSlot.call(this, cursorSlotId);
            const stackable = Slot.stackable(clickedSlot, cursorSlot);

            if (mode === 0) { // normal click
                if (mouseButton === 0) { // left mouse click
                    if (stackable) {

                        // stack both slots
                        const { stack, rest } = Slot.stack(clickedSlot, cursorSlot);
                        inventory.setSlot.call(this, cursorSlotId, stack);
                        inventory.setSlot.call(this, clickedSlotId, rest);

                    } else {

                        // swap slots
                        let oldCursorSlot = cursorSlot;
                        inventory.setSlot.call(this, cursorSlotId, clickedSlot);
                        inventory.setSlot.call(this, clickedSlotId, oldCursorSlot);

                    }
                } else if (mouseButton === 1) { // right mouse click
                    if (stackable) {
                        if (cursorSlot === undefined) {

                            // move half of clicked slot to cursor slot
                            const { bigger, smaller } = Slot.split(clickedSlot);
                            inventory.setSlot.call(this, cursorSlotId, smaller);
                            inventory.setSlot.call(this, clickedSlotId, bigger);

                        } else {

                            // drop one from cursor slot to clicked slot
                            const { slot1: newCursorSlot, slot2: newClickedSlot } = Slot.moveOne(cursorSlot, clickedSlot);
                            inventory.setSlot.call(this, cursorSlotId, newCursorSlot);
                            inventory.setSlot.call(this, clickedSlotId, newClickedSlot);

                        }
                    } else {

                        // swap slots, same as left click
                        let oldCursorSlot = cursorSlot;
                        inventory.setSlot.call(this, cursorSlotId, clickedSlot);
                        inventory.setSlot.call(this, clickedSlotId, oldCursorSlot);

                    }
                }
            } else if (mode === 1) { // shift click
                if (mouseButton === 0 || mouseButton === 1) { // left click and right click have same behavior
                    // todo: implemented
                    // todo: how exactly does the Client decide which slots to move to?
                }
            } else if (mode === 2) { // number key click
                //todo: check if mouseButton >= 0 && mouseButton <= 8, and if not, emit misbehavior

                const numberKeySlotId = mouseButton + 36; // 36 is the first slot in the hotbar
                const numberKeySlot = inventory.getSlot.call(this, numberKeySlotId);

                if (cursorSlot !== undefined) { } // nothing happens if cursor slot is not empty
                else {

                    // swap clicked slot with number key slot
                    let oldNumberKeySlot = numberKeySlot;
                    inventory.setSlot.call(this, numberKeySlotId, clickedSlot);
                    inventory.setSlot.call(this, clickedSlotId, oldNumberKeySlot);

                }
            } else if (mode === 3) {  // middle mouse click, not possible in inventory
                // todo: emit misbehavior
            } else if (mode === 4) { // drop
                if (clickedSlotId === -999) { // click outside window
                    // todo: emit event
                } else { // click on slot
                    if (mouseButton === 0) { // drop key click
                        if (cursorSlot !== undefined) { } // nothing happens if cursor slot is not empty
                        else if (clickedSlot === undefined) { } // nothing happens if clicked slot is empty
                        else {

                            // drop one from clicked slot
                            const { slot1: newClickedSlot } = Slot.moveOne(clickedSlot);
                            // const { slot1: newClickedSlot, slot2: droppedSlot } = Slot.moveOne(clickedSlot);
                            inventory.setSlot.call(this, clickedSlotId, newClickedSlot);
                            // todo: drop droppedSlot

                        }
                    } else if (mouseButton === 1) { // ctrl + drop key click
                        if (cursorSlot !== undefined) { } // nothing happens if cursor slot is not empty
                        else if (clickedSlot === undefined) { } // nothing happens if clicked slot is empty
                        else {

                            // drop all from clicked slot
                            // let oldClickedSlot = clickedSlot;
                            inventory.setSlot.call(this, clickedSlotId, undefined);
                            // todo: drop oldClickedSlot

                        }
                    }
                }
            } else if (mode === 5) { // drag
                //todo: implement dragging
            } else if (mode === 6) { // double click
                //todo: implement double click
            }
        }
        // else
        // not implemented
    }
}