const { CustomError } = require('../../../../CustomError.js');

module.exports = {
    slot: {
        info: {
            callAfterLogin: true
        },
        get: function () {
            return this.p._slot
        },
        set: function (v) {
            if (!this.p.canUsed)
                if (this.online)
                    throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
                else
                    throw new Error(`Can't perform this action on an offline player`)

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