const { CustomError } = require('../../CustomError.js');

module.exports = {
    held_item_slot: function ({ slotId }) {
        if (slotId < 0 || slotId > 8)
                /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'client', [
                    ['', 'slotId', ''],
                    ['in the event ', 'held_item_slot', '']
                    ['in the class ', this.constructor.name, '']
                ], {
                    got: slotId,
                    expectationType: 'value',
                    expectation: [0, 1, 2, 3, 4, 5, 6, 7, 8]
                }).toString()

        this.p._slot = slotId;
        this.p.emitObservable('slot');
    }
}