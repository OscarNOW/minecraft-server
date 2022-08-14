const { defaults } = require('../../../../../../settings.json');
const CustomError = require('../../../../CustomError.js');

module.exports = {
    gamemode: {
        info: {
            loginPacket: [
                'gameMode'
            ]
        },
        get: function () {
            return this.p._gamemode
        },
        set: function (value) {
            if (!this.p.canUsed)
                if (this.online)
                    throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
                else
                    throw new Error(`Can't perform this action on an offline player`)

            if (!['survival', 'creative', 'adventure', 'spectator'].includes(value))
                throw new CustomError('expectationNotMet', 'libraryUser', [
                    ['', 'gamemode', ''],
                    ['in the function "', 'set gamemode', '"'],
                    ['in the class ', this.constructor.name, ''],
                ], {
                    got: value,
                    expectationType: 'value',
                    expectation: ['survival', 'creative', 'adventure', 'spectator']
                }).toString()

            this.p.sendPacket('game_state_change', {
                reason: 3,
                gameMode: ['survival', 'creative', 'adventure', 'spectator'].indexOf(value)
            })

            this.p._gamemode = value;
            this.p.emitObservable('gamemode');
        },
        setRaw: function (value, loginPacket) {
            if (!['survival', 'creative', 'adventure', 'spectator'].includes(value))
                throw new CustomError('expectationNotMet', 'libraryUser', [
                    ['', 'gamemode', ''],
                    ['in the function "', 'setRaw gamemode', '"'],
                    ['in the class ', this.constructor.name, ''],
                ], {
                    got: value,
                    expectationType: 'value',
                    expectation: ['survival', 'creative', 'adventure', 'spectator']
                }).toString()

            this.p._gamemode = value;

            if (loginPacket)
                return { gameMode: ['survival', 'creative', 'adventure', 'spectator'].indexOf(value) }
            else
                this.p.sendPacket('game_state_change', {
                    reason: 3,
                    gameMode: ['survival', 'creative', 'adventure', 'spectator'].indexOf(value)
                })
        },
        init: function () {
            this.p._gamemode = defaults.gamemode;
        }
    }
}