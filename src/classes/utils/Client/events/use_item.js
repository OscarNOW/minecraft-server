const CustomError = require('../../CustomError.js');

module.exports = {
    use_item: function ({ hand }) {
        if (hand !== 0 && hand !== 1)
            this.p.emitError(new CustomError('expectationNotMet', 'client', `hand in  <remote ${this.constructor.name}>.use_item({ hand: ${require('util').inspect(hand)} })  `, {
                got: hand,
                expectationType: 'value',
                expectation: [0, 1]
            }, null, { server: this.server, client: this }));

        this.p.emit('itemUse', hand === 0);
    }
}