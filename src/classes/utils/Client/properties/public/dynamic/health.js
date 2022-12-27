const CustomError = require('../../../../CustomError.js');

module.exports = {
    health: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get: function () {
            return this.p._health;
        },
        set: function (newValue) {
            if (!this.p.stateHandler.checkReady.call(this))
                return;

            newValue = Math.round(parseFloat(newValue));
            if (newValue < 0) newValue = 0;
            if (newValue > 20) newValue = 20;

            if (isNaN(newValue))
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `health in  <${this.constructor.name}>.health = ${require('util').inspect(newValue)}  `, {
                    got: arguments[0],
                    expectationType: 'type',
                    expectation: 'number'
                }, null, { server: this.server, client: this }));

            const oldValue = this.health;
            this.p._health = newValue;

            this.p.sendPacket('update_health', {
                health: newValue,
                food: this.food,
                foodSaturation: this.foodSaturation
            });

            if (oldValue !== newValue)
                this.p.emitChange('health', oldValue);
        },
        setRaw: function (v) {
            const value = parseInt(v);

            if (isNaN(value) || value < 0 || value > 20)
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `health in  <${this.constructor.name}>.health = ${require('util').inspect(value)}  `, {
                    got: v,
                    expectationType: 'value',
                    expectation: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
                }, null, { server: this.server, client: this }));

            this.p._health = value;

            this.p.sendPacket('update_health', {
                health: value,
                food: this.food,
                foodSaturation: this.food
            });
        },
        init: function () {
            this.p._health = 20;
        }
    }
}