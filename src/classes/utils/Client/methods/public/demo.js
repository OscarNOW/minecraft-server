const { demoMessages } = require('../../../../../functions/loader/data.js');

module.exports = function (message) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    if (!demoMessages.find(({ name }) => name === message))
        throw new Error(`Unknown demo message "${message}"`);

    this.p.sendPacket('game_state_change', {
        reason: 5,
        gameMode: demoMessages.find(({ name }) => name === message).id
    })
}