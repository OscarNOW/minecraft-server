const CustomError = require('../../../../CustomError.js');

module.exports = {
    slot: {
        info: {
            callAfterLogin: true
        },
        get: function () {
            return this.p._slot
        },
        set: function (v) {
            if (!this.p.stateHandler.checkReady.call(this))
                return;

            let value = parseInt(v);

            if (isNaN(value))
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `slot in  <${this.constructor.name}>.slot = ${require('util').inspect(value)}  `, {
                    got: v,
                    expectationType: 'type',
                    expectation: 'number'
                }, null, { server: this.server, client: this }));

            value = value % 9;

            const changed = value !== this.slot;

            this.p.sendPacket('held_item_slot', {
                slot: value
            });

            this.p._slot = value;
            if (changed)
                this.p.emitChange('slot');
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
            })
        },
        init: function () {
            this.p._slot = 0;
        }
    }
}