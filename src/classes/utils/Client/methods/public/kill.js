const Text = require('../../../../exports/Text.js');

module.exports = function (deathMessage = '') {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    if (!(deathMessage instanceof Text))
        deathMessage = new Text(deathMessage);

    this.p.sendPacket('combat_event', {
        event: 2,
        playerId: this.entityId,
        entityId: -1, //killer
        message: JSON.stringify(deathMessage.chat)
    });
}