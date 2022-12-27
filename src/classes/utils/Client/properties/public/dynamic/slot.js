const CustomError = require('../../../../CustomError.js');

module.exports = {
    slot: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get: function () {
            return this.p._slot;
        },
        set: function (v) {
            if (!this.p.stateHandler.checkReady.call(this))
                return;

            let newValue = parseInt(v);
            newValue = newValue % 9;

            if (isNaN(newValue))
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `slot in  <${this.constructor.name}>.slot = ${require('util').inspect(newValue)}  `, {
                    got: v,
                    expectationType: 'type',
                    expectation: 'number'
                }, null, { server: this.server, client: this }));

            const oldValue = this.slot;
            this.p._slot = newValue;

            this.p.sendPacket('held_item_slot', {
                slot: newValue
            });

            if (oldValue !== newValue)
                this.p.emitChange('slot', oldValue);
        },
        setRaw: function (v) {
            let value = parseInt(v);

            if (isNaN(value))
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `slot in  <${this.constructor.name}>.slot = ${require('util').inspect(value)}  `, {
                    got: v,
                    expectationType: 'type',
                    expectation: 'number'
                }, null, { server: this.server, client: this }));

            value = value % 9;

            this.p._slot = value;
            this.p.sendPacket('held_item_slot', {
                slot: value
            });
        },
        init: function () {
            this.p._slot = 0;
        }
    }
}