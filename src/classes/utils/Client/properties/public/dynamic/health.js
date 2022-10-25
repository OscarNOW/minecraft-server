const CustomError = require('../../../../CustomError.js');

module.exports = {
    health: {
        info: {
            callAfterLogin: true
        },
        get: function () {
            return this.p._health
        },
        set: function (v) {
            if (!this.p.stateHandler.checkReady.call(this))
                return;

            const value = parseInt(v);

            if (isNaN(value) || value < 0 || value > 20)
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `health in  <${this.constructor.name}>.health = ${require('util').inspect(value)}  `, {
                    got: v,
                    expectationType: 'value',
                    expectation: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
                }, null, { server: this.server, client: this }));

            let changed = value !== this.health;

            this.p.sendPacket('update_health', {
                health: value,
                food: this.food,
                foodSaturation: this.foodSaturation
            })

            this.p._health = value;
            if (changed)
                this.p.emitChange('health');
        },
        setRaw: function (v) {
            const value = parseInt(v);

            if (isNaN(value) || value < 0 || value > 20)
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `health in  <${this.constructor.name}>.health = ${require('util').inspect(value)}  `, {
                    got: v,
                    expectationType: 'value',
                    expectation: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
                }, null, { server: this.server, client: this }));

            this.p.sendPacket('update_health', {
                health: value,
                food: this.food,
                foodSaturation: this.food
            })

            this.p._health = value;
        },
        init: function () {
            this.p._health = 20;
        }
    }
}