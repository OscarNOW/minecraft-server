const CustomError = require('../../../../CustomError.js');

module.exports = {
    toxicRainLevel: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get: function () {
            return this.p._toxicRainLevel;
        },
        set: function (newValue) {
            if (!this.p.stateHandler.checkReady.call(this))
                return;

            if (typeof newValue !== 'number')
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `toxicRainLevel in  <${this.constructor.name}>.toxicRainLevel = ${require('util').inspect(newValue)}  `, {
                    got: newValue,
                    expectationType: 'type',
                    expectation: 'number'
                }, null, { server: this.server, client: this }));

            const oldValue = this.toxicRainLevel;
            this.p._toxicRainLevel = newValue;

            if (this.raining)
                this.p.sendPacket('game_state_change', {
                    reason: 7,
                    gameMode: newValue + 1
                })

            if (oldValue !== newValue)
                this.p.emitChange('toxicRainLevel', oldValue);
        },
        setRaw: function (value) {
            if (typeof value !== 'number')
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `toxicRainLevel in  <${this.constructor.name}>.toxicRainLevel = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'type',
                    expectation: 'number'
                }, null, { server: this.server, client: this }));

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