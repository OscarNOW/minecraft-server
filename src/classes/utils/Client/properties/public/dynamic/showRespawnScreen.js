const { defaults } = require('../../../../../../settings.json');
const CustomError = require('../../../../CustomError.js');

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
        get: function () {
            return this.p._showRespawnScreen;
        },
        set: function (newValue, beforeReady, loginPacket) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            if (typeof newValue !== 'boolean')
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `showRespawnScreen in  <${this.constructor.name}>.showRespawnScreen = ${require('util').inspect(newValue)}  `, {
                    got: newValue,
                    expectationType: 'type',
                    expectation: 'boolean'
                }, null, { server: this.server, client: this }));

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
        init: function () {
            this.p._showRespawnScreen = defaults.showRespawnScreen;
        }
    }
}