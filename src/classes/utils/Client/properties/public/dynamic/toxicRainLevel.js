const CustomError = require('../../../../CustomError.js');

module.exports = {
    toxicRainLevel: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get: function () {
            return this.p._toxicRainLevel
        },
        set: function (value) {
            if (!this.p.stateHandler.checkReady.call(this))
                return;

            if (typeof value !== 'number')
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `toxicRainLevel in  <${this.constructor.name}>.toxicRainLevel = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'type',
                    expectation: 'number'
                }, null, { server: this.server, client: this }));

            const changed = value !== this.toxicRainLevel;

            if (this.raining)
                this.p.sendPacket('game_state_change', {
                    reason: 7,
                    gameMode: value + 1
                })

            this.p._toxicRainLevel = value;
            if (changed)
                this.p.emitChange('toxicRainLevel');
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