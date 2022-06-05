module.exports = {
    respawnScreen: {
        get: function () {
            return this.p._respawnScreen
        },
        set: function (respawnScreen) {
            if (!this.p.canUsed)
                throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

            if (respawnScreen !== true && respawnScreen !== false)
                throw new Error(`Unknown respawnScreen, expected true or false, received "${respawnScreen}" (${typeof respawnScreen})`)

            this.p.sendPacket('game_state_change', {
                reason: 11,
                gameMode: respawnScreen ? 0 : 1
            })

            this.p._respawnScreen = respawnScreen;
            this.p.emitObservable('respawnScreen');
        },
        init: function () {
            this.p._respawnScreen = true;
        }
    }
}