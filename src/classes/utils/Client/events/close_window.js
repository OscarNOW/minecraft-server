const CustomError = require('../../CustomError.js');

module.exports = {
    close_window: function ({ windowId }) {
        this.p.stateHandler.checkReady.call(this);
        if (windowId !== this.p.windowId && windowId !== 0)
            this.p.emitError(new CustomError('expectationNotMet', 'client', `windowId in  <remote ${this.constructor.name}>.close_window({ windowId: ${require('util').inspect(windowId)} })  `, {
                got: windowId,
                expectationType: 'value',
                expectation: [this.p.windowId]
            }))

        if (windowId === 0)
            return; //not implemented            

        this.p.emit('windowClose');
    }
}