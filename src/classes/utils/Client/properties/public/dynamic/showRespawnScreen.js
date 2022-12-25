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
            return this.p._showRespawnScreen
        },
        set: function (value) {
            if (!this.p.stateHandler.checkReady.call(this))
                return;

            if (typeof value !== 'boolean')
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `showRespawnScreen in  <${this.constructor.name}>.showRespawnScreen = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'type',
                    expectation: 'boolean'
                }, null, { server: this.server, client: this }));

            const changed = value !== this.showRespawnScreen;

            this.p.sendPacket('game_state_change', {
                reason: 11,
                gameMode: value ? 0 : 1
            })

            this.p._showRespawnScreen = value;
            if (changed)
                this.p.emitChange('showRespawnScreen');
        },
        setRaw: function (value, loginPacket) {
            if (typeof value !== 'boolean')
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `showRespawnScreen in  <${this.constructor.name}>.showRespawnScreen = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'type',
                    expectation: 'boolean'
                }, null, { server: this.server, client: this }));

            this.p._showRespawnScreen = value;

            if (loginPacket)
                return { enableRespawnScreen: value }
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