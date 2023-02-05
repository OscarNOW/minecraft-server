const { demoMessages } = require('../../../../../functions/loader/data.js');

const CustomError = require('../../../CustomError.js');

module.exports = function (message) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    if (!demoMessages.find(({ name }) => name === message))
        this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `message in  <${this.constructor.name}>.demo(${require('util').inspect(message)})  `, {
            got: message,
            expectationType: 'value',
            expectation: demoMessages.map(({ name }) => name)
        }, this.demo, { server: this.server, client: this }));

    this.p.sendPacket('game_state_change', {
        reason: 5,
        gameMode: demoMessages.find(({ name }) => name === message).id
    })
}