module.exports = {
    gamemode: {
        get: function () {
            return this[this.ps._gamemode]
        },
        set: function (gamemode) {
            if (!this[this.ps.canUsed])
                throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

            if (!['survival', 'creative', 'adventure', 'spectator'].includes(gamemode))
                throw new Error(`Unknown gamemode "${gamemode}" (${typeof gamemode})`)

            this[this.ps.sendPacket]('game_state_change', {
                reason: 3,
                gameMode: ['survival', 'creative', 'adventure', 'spectator'].indexOf(gamemode)
            })

            this[this.ps._gamemode] = gamemode;
            this[this.ps.emitObservable]('gamemode');
        },
        init: function () {
            this[this.ps._gamemode] = 'survival';
        }
    }
}