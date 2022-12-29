const CustomError = require('../../../../CustomError.js');

module.exports = {
    raining: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get: function () {
            return this.p._raining;
        },
        set: function (newValue, beforeReady) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            if (typeof newValue !== 'boolean')
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `raining in  <${this.constructor.name}>.raining = ${require('util').inspect(newValue)}  `, {
                    got: newValue,
                    expectationType: 'type',
                    expectation: 'boolean'
                }, null, { server: this.server, client: this }));

            const oldValue = this.raining;
            this.p._raining = newValue;

            this.p.sendPacket('game_state_change', {
                reason: 7,
                gameMode: this.raining ? this.toxicRainLevel + 1 : 0
            });

            if ((!beforeReady) && oldValue !== newValue)
                this.p.emitChange('raining', oldValue);
        },
        init: function () {
            this.p._raining = false;
        }
    }
}