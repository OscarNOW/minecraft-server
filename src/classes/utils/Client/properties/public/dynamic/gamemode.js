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
            if (!this.p.stateHandler.checkReady.call(this))
                return;

            if (!['survival', 'creative', 'adventure', 'spectator'].includes(value))
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `gamemode in  <${this.constructor.name}>.gamemode = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'value',
                    expectation: ['survival', 'creative', 'adventure', 'spectator']
                }, null, { server: this.server, client: this }));

            this.p.sendPacket('game_state_change', {
                reason: 3,
                gameMode: ['survival', 'creative', 'adventure', 'spectator'].indexOf(value)
            })

            this.p._gamemode = value;
            this.p.emitObservable('gamemode');
        },
        setRaw: function (value, loginPacket) {
            if (!['survival', 'creative', 'adventure', 'spectator'].includes(value))
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `gamemode in  <${this.constructor.name}>.gamemode = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'value',
                    expectation: ['survival', 'creative', 'adventure', 'spectator']
                }, null, { server: this.server, client: this }));

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