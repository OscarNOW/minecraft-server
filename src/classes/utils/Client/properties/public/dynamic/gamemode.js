const { defaults } = require('../../../../../../settings.json');
const CustomError = require('../../../../CustomError.js');

const { gamemodes } = require('../../../../../../functions/loader/data.js');

module.exports = {
    gamemode: {
        info: {
            defaultable: true,
            defaultSetTime: 'loginPacket',
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
        set: function (newValue) {
            if (!this.p.stateHandler.checkReady.call(this))
                return;

            if (!gamemodes.includes(newValue))
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `gamemode in  <${this.constructor.name}>.gamemode = ${require('util').inspect(newValue)}  `, {
                    got: newValue,
                    expectationType: 'value',
                    expectation: gamemodes
                }, null, { server: this.server, client: this }));

            const oldValue = this.gamemode;
            this.p._gamemode = newValue;

            this.p.sendPacket('game_state_change', {
                reason: 3,
                gameMode: gamemodes.indexOf(newValue)
            });

            if (oldValue !== newValue)
                this.p.emitChange('gamemode', oldValue);
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