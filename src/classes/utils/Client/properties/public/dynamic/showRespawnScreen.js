const { defaults } = require('../../../../../../settings.json');

module.exports = {
    showRespawnScreen: {
        info: {
            loginPacket: [
                'enableRespawnScreen'
            ]
        },
        get: function () {
            return this.p._showRespawnScreen
        },
        set: function (value) {
            if (!this.p.canUsed)
                if (this.online)
                    throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
                else
                    throw new Error(`Can't perform this action on an offline player`)

            if (![true, false].includes(value))
                throw new Error(`Unknown showRespawnScreen, expected true or false, received "${value}" (${typeof value})`)

            this.p.sendPacket('game_state_change', {
                reason: 11,
                gameMode: value ? 0 : 1
            })

            this.p._showRespawnScreen = value;
            this.p.emitObservable('showRespawnScreen');
        },
        setRaw: function (value, loginPacket) {
            if (value !== true && value !== false)
                throw new Error(`Unknown showRespawnScreen, expected true or false, received "${value}" (${typeof value})`)

            this.p._showRespawnScreen = value;

            if (loginPacket)
                return { enableRespawnScreen: value ? 0 : 1 }
            else
                this.p.sendPacket('game_state_change', {
                    reason: 11,
                    gameMode: value ? 0 : 1
                })
        },
        init: function () {
            this.p._showRespawnScreen = defaults.showRespawnScreen;
        }
    }
}