let _default = 'survival';

module.exports = {
    gamemode: {
        info: {
            loginPacket: {
                gameMode: ['survival', 'creative', 'adventure', 'spectator'].indexOf(_default)
            }
        },
        get: function () {
            return this.p._gamemode
        },
        set: function (gamemode) {
            if (!this.p.canUsed)
                if (this.online)
                    throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
                else
                    throw new Error(`Can't perform this action on an offline player`)

            if (!['survival', 'creative', 'adventure', 'spectator'].includes(gamemode))
                throw new Error(`Unknown gamemode "${gamemode}" (${typeof gamemode})`)

            this.p.sendPacket('game_state_change', {
                reason: 3,
                gameMode: ['survival', 'creative', 'adventure', 'spectator'].indexOf(gamemode)
            })

            this.p._gamemode = gamemode;
            this.p.emitObservable('gamemode');
        },
        setDefault: function (gamemode) {
            if (!['survival', 'creative', 'adventure', 'spectator'].includes(gamemode))
                throw new Error(`Unknown gamemode "${gamemode}" (${typeof gamemode})`)

            this.p._gamemode = gamemode;

            return { gameMode: ['survival', 'creative', 'adventure', 'spectator'].indexOf(gamemode) }
        },
        init: function () {
            this.p._gamemode = _default;
        }
    }
}