const CustomError = require('../../../../CustomError.js');

module.exports = {
    toxicRainLevel: {
        info: {
            callAfterLogin: true
        },
        get: function () {
            return this.p._toxicRainLevel
        },
        set: function (value) {
            this.p.stateHandler.checkReady.call(this);

            if (typeof value != 'number')
                throw new CustomError('expectationNotMet', 'libraryUser', `toxicRainLevel in  <${this.constructor.name}>.toxicRainLevel = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'type',
                    expectation: 'number'
                }).toString()

            if (this.raining)
                this.p.sendPacket('game_state_change', {
                    reason: 7,
                    gameMode: value + 1
                })

            this.p._toxicRainLevel = value;
            this.p.emitObservable('toxicRainLevel');
        },
        setRaw: function (value) {
            if (typeof value != 'number')
                throw new CustomError('expectationNotMet', 'libraryUser', `toxicRainLevel in  <${this.constructor.name}>.toxicRainLevel = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'type',
                    expectation: 'number'
                }).toString()

            if (this.raining)
                this.p.sendPacket('game_state_change', {
                    reason: 7,
                    gameMode: value + 1
                })

            this.p._toxicRainLevel = value;
        },
        init: function () {
            this.p._toxicRainLevel = 0;
        }
    }
}