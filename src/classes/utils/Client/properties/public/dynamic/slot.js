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
            this.p.stateHandler.checkReady.call(this);

            let value = parseInt(v);

            if (isNaN(value))
                throw new CustomError('expectationNotMet', 'libraryUser', [
                    ['', 'slot', ''],
                    ['in the function "', 'set slot', '"'],
                    ['in the class ', this.constructor.name, ''],
                ], {
                    got: v,
                    expectationType: 'type',
                    expectation: 'number'
                }).toString()

            value = value % 9;

            this.p._slot = value;
            this.p.sendPacket('held_item_slot', {
                slot: value
            })
        },
        setRaw: function (v) {
            let value = parseInt(v);

            if (isNaN(value))
                throw new CustomError('expectationNotMet', 'libraryUser', [
                    ['', 'slot', ''],
                    ['in the function "', 'setRaw slot', '"'],
                    ['in the class ', this.constructor.name, ''],
                ], {
                    got: v,
                    expectationType: 'type',
                    expectation: 'number'
                }).toString()

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