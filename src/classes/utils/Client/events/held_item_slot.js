module.exports = {
    held_item_slot: function ({ slotId }) {
        if (slotId < 0 || slotId > 8)
            throw new Error(`Unknown slotId "${slotId}" (${typeof slotId})`)

        this.p._slot = slotId;
        this.p.emitObservable('slot');
    }
}