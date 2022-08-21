const { defaults } = require('../../../../../../settings.json');
const CustomError = require('../../../../CustomError.js');

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
            this.p.stateHandler.checkReady.call(this);

            if (typeof value != 'boolean')
                throw new CustomError('expectationNotMet', 'libraryUser', `showRespawnScreen in  <${this.constructor.name}>.showRespawnScreen = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'type',
                    expectation: 'boolean'
                }).toString()

            this.p.sendPacket('game_state_change', {
                reason: 11,
                gameMode: value ? 0 : 1
            })

            this.p._showRespawnScreen = value;
            this.p.emitObservable('showRespawnScreen');
        },
        setRaw: function (value, loginPacket) {
            if (typeof value != 'boolean')
                throw new CustomError('expectationNotMet', 'libraryUser', `showRespawnScreen in  <${this.constructor.name}>.showRespawnScreen = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'type',
                    expectation: 'boolean'
                }).toString()

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