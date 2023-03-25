const CustomError = require('../../../../CustomError.js');

module.exports = {
    slot: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get() {
            return this.p._slot;
        },
        set(v, beforeReady) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            let newValue = parseInt(v);
            newValue %= 9;

            if (Number.isNaN(newValue))
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `slot in  <${this.constructor.name}>.slot = ${require('util').inspect(newValue)}  `, {
                    got: v,
                    expectationType: 'type',
                    expectation: 'number'
                }, null, { server: this.server, client: this }));

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