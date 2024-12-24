const { defaults } = require('../../../../../../settings.json');

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
        get() {
            return this.p._gamemode;
        },
        set(newValue, beforeReady, loginPacket) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            if (!gamemodes.includes(newValue))
                throw new Error(`Unknown gamemode "${newValue}"`);

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
        init() {
            this.p._gamemode = defaults.gamemode;
        }
    }
}