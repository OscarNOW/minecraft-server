const CustomError = require('../../CustomError.js');

module.exports = {
    close_window({ windowId }) {
        if (!this.p.stateHandler.checkReady.call(this))
            return;

        if (windowId !== this.p.windowId && windowId !== 0)
            this.p.emitError(new CustomError('expectationNotMet', 'client', `windowId in  <remote ${this.constructor.name}>.close_window({ windowId: ${require('util').inspect(windowId)} })  `, {
                got: windowId,
                expectationType: 'value',
                expectation: [this.p.windowId]
            }, null, { server: this.server, client: this }));

        this.p.windowId = null;

        if (windowId === 0)
            return this.p.emit('inventoryClose');

        this.p.emit('windowClose');
    }
}