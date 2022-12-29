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
            return this.p._gamemode;
        },
        set: function (newValue, beforeReady, loginPacket) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            if (!gamemodes.includes(newValue))
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `gamemode in  <${this.constructor.name}>.gamemode = ${require('util').inspect(newValue)}  `, {
                    got: newValue,
                    expectationType: 'value',
                    expectation: gamemodes
                }, null, { server: this.server, client: this }));

            const oldValue = this.gamemode;
            this.p._gamemode = newValue;

            if (!loginPacket)
                this.p.sendPacket('game_state_change', {
                    reason: 3,
                    gameMode: gamemodes.indexOf(this.gamemode)
                });

            if ((!beforeReady) && oldValue !== newValue)
                this.p.emitChange('gamemode', oldValue);

            if (loginPacket)
                return { gameMode: gamemodes.indexOf(newValue) }
        },
        init: function () {
            this.p._gamemode = defaults.gamemode;
        }
    }
}