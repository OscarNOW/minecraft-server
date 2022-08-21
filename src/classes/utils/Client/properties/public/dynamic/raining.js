const CustomError = require('../../../../CustomError.js');

module.exports = {
    raining: {
        info: {
            callAfterLogin: true
        },
        get: function () {
            return this.p._raining
        },
        set: function (value) {
            this.p.stateHandler.checkReady.call(this);

            if (typeof value != 'boolean')
                throw new CustomError('expectationNotMet', 'libraryUser', `raining in  <${this.constructor.name}>.raining = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'type',
                    expectation: 'boolean'
                }).toString()

            this.p.sendPacket('game_state_change', {
                reason: 7,
                gameMode: value ? this.toxicRainLevel + 1 : 0
            })

            this.p._raining = value;
            this.p.emitObservable('raining');
        },
        setRaw: function (value) {
            if (typeof value != 'boolean')
                throw new CustomError('expectationNotMet', 'libraryUser', `raining in  <${this.constructor.name}>.raining = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'type',
                    expectation: 'boolean'
                }).toString()

            this.p.sendPacket('game_state_change', {
                reason: 7,
                gameMode: value ? this.toxicRainLevel + 1 : 0
            })

            this.p._raining = value;
        },
        init: function () {
            this.p._raining = false;
        }
    }
}