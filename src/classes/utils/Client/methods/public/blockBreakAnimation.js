const CustomError = require('../../../CustomError.js');

module.exports = function (location, stage) {
    this.p.stateHandler.checkReady.call(this);

    if (stage < 0 || stage > 10)
        this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `stage in  <${this.constructor.name}>.blockBreakAnimation(..., ${require('util').inspect(stage)})  `, {
            got: stage,
            expectationType: 'value',
            expectation: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }, null, { server: this.server, client: this }));

    this.p.sendPacket('block_break_animation', {
        entityId: Math.floor(Math.random() * 1000),
        location,
        destroyStage: stage == 0 ? 10 : stage - 1
    })
}
