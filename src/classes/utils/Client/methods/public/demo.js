const { demoMessages } = require('../../../../../functions/loader/data.js');

const CustomError = require('../../../CustomError.js');

module.exports = function (message) {
    if (!this.p.stateHandler.checkReady.call(this.client))
        return;

    if (demoMessages[message] === undefined)
        this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `message in  <${this.constructor.name}>.demo(${require('util').inspect(message)})  `, {
            got: message,
            expectationType: 'value',
            expectation: Object.keys(demoMessages)
        }, this.demo, { server: this.server, client: this }));

    this.p.sendPacket('game_state_change', {
        reason: 5,
        gameMode: demoMessages[message]
    })
}