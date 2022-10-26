module.exports = function (showCredits) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    if (!showCredits)
        throw new Error('Not implemented')

    this.p.sendPacket('game_state_change', {
        reason: 4,
        gameMode: showCredits ? 1 : 0
    })
}