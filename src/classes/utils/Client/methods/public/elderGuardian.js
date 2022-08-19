module.exports = {
    elderGuardian: function () {
        this.p.stateHandler.checkReady.call(this);

        this.p.sendPacket('game_state_change', {
            reason: 10
        })
    }
}