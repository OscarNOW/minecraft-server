const { defaults } = require('../../../../../../settings.json');

module.exports = {
    showRespawnScreen: {
        info: {
            defaultable: true,
            defaultSetTime: 'loginPacket',
            loginPacket: [
                {
                    name: 'showRespawnScreen',
                    minecraftName: 'enableRespawnScreen'
                }
            ]
        },
        get() {
            return this.p._showRespawnScreen;
        },
        set(newValue, beforeReady, loginPacket) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            if (typeof newValue !== 'boolean')
                throw new Error(`Expected showRespawnScreen to be a boolean, received ${newValue} (${typeof newValue})`);

            const oldValue = this.showRespawnScreen;
            this.p._showRespawnScreen = newValue;

            if (!loginPacket)
                this.p.sendPacket('game_state_change', {
                    reason: 11,
                    gameMode: this.showRespawnScreen ? 0 : 1
                });

            if ((!beforeReady) && oldValue !== newValue)
                this.p.emitChange('showRespawnScreen', oldValue);

            if (loginPacket)
                return { enableRespawnScreen: newValue }
        },
        init() {
            this.p._showRespawnScreen = defaults.showRespawnScreen;
        }
    }
}