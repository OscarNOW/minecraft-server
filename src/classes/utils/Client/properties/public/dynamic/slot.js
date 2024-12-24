module.exports = {
    slot: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get() {
            return this.p._slot;
        },
        set(newValue, beforeReady) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            if (typeof newValue !== 'number' || isNaN(newValue) || newValue < 0 || newValue > 9)
                throw new Error(`slot must be an integer between 0 and 9, received ${newValue} (${typeof newValue})`);

            const oldValue = this.slot;
            this.p._slot = newValue;

            this.p.sendPacket('held_item_slot', {
                slot: this.slot
            });

            if ((!beforeReady) && oldValue !== newValue)
                this.p.emitChange('slot', oldValue);
        },
        init() {
            this.p._slot = 0;
        }
    }
}