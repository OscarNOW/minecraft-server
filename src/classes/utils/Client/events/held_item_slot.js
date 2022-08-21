const CustomError = require('../../CustomError.js');

module.exports = {
    held_item_slot: function ({ slotId }) {
        if (slotId < 0 || slotId > 8)
            throw new CustomError('expectationNotMet', 'client', `slotId in  <remote ${this.constructor.name}>.held_item_slot({ slotId: ${require('util').inspect(slotId)} })  `, {
                got: slotId,
                expectationType: 'value',
                expectation: [0, 1, 2, 3, 4, 5, 6, 7, 8]
            }).toString()

        this.p._slot = slotId;
        this.p.emitObservable('slot');
    }
}