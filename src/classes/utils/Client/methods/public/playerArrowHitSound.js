module.exports = function () {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    this.p.sendPacket('game_state_change', {
        reason: 6
    })
}