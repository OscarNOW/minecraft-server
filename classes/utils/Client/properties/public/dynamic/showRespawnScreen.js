module.exports = {
    showRespawnScreen: {
        get: function () {
            return this.p._showRespawnScreen
        },
        set: function (showRespawnScreen) {
            if (!this.p.canUsed)
                if (this.online)
                    throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
                else
                    throw new Error(`Can't perform this action on an offline player`)

            if (showRespawnScreen !== true && showRespawnScreen !== false)
                throw new Error(`Unknown showRespawnScreen, expected true or false, received "${showRespawnScreen}" (${typeof showRespawnScreen})`)

            this.p.sendPacket('game_state_change', {
                reason: 11,
                gameMode: showRespawnScreen ? 0 : 1
            })

            this.p._showRespawnScreen = showRespawnScreen;
            this.p.emitObservable('showRespawnScreen');
        },
        init: function () {
            this.p._showRespawnScreen = true;
        }
    }
}