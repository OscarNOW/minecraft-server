const { defaults } = require('../../../../../../settings.json');
const CustomError = require('../../../../CustomError.js');

const gamemodes = require('../../../../../../data/gamemodes.json');

module.exports = {
    gamemode: {
        info: {
            loginPacket: [
                {
                    name: 'gamemode',
                    minecraftName: 'gameMode'
                }
            ]
        },
        get: function () {
            return this.p._gamemode
        },
        set: function (value) {
            if (!this.p.stateHandler.checkReady.call(this))
                return;

            if (!gamemodes.includes(value))
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `gamemode in  <${this.constructor.name}>.gamemode = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'value',
                    expectation: gamemodes
                }, null, { server: this.server, client: this }));

            const changed = value !== this.gamemode;

            this.p.sendPacket('game_state_change', {
                reason: 3,
                gameMode: gamemodes.indexOf(value)
            })

            this.p._gamemode = value;
            if (changed)
                this.p.emitChange('gamemode');
        },
        setRaw: function (value, loginPacket) {
            if (!gamemodes.includes(value))
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `gamemode in  <${this.constructor.name}>.gamemode = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'value',
                    expectation: gamemodes
                }, null, { server: this.server, client: this }));

            this.p._gamemode = value;

            if (loginPacket)
                return { gameMode: gamemodes.indexOf(value) }
            else
                this.p.sendPacket('game_state_change', {
                    reason: 3,
                    gameMode: gamemodes.indexOf(value)
                })
        },
        init: function () {
            this.p._gamemode = defaults.gamemode;
        }
    }
}