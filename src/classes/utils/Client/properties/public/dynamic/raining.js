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
            if (!this.p.stateHandler.checkReady.call(this))
                return;

            if (typeof value !== 'boolean')
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `raining in  <${this.constructor.name}>.raining = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'type',
                    expectation: 'boolean'
                }, null, { server: this.server, client: this }));

            const changed = value !== this.raining;

            this.p.sendPacket('game_state_change', {
                reason: 7,
                gameMode: value ? this.toxicRainLevel + 1 : 0
            })

            this.p._raining = value;
            if (changed)
                this.p.emitChange('raining');
        },
        setRaw: function (value) {
            if (typeof value !== 'boolean')
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `raining in  <${this.constructor.name}>.raining = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'type',
                    expectation: 'boolean'
                }, null, { server: this.server, client: this }));

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