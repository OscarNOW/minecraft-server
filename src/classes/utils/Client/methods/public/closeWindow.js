const CustomError = require('../../../CustomError.js');

module.exports = function () {
    this.p.stateHandler.checkReady.call(this);
    if (this.p.windowId === null || this.p.windowId === undefined)
        this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `window  opened window  `, {
            got: 'no open window',
            expectationType: 'value',
            expectation: 'open window'
        }, this.constructor))

    this.p.sendPacket('close_window', {
        windowId: this.p.windowId
    })

    this.p.windowId = null;
}