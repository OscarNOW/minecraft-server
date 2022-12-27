const CustomError = require('../../../../CustomError.js');

module.exports = {
    food: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get: function () {
            return this.p._food
        },
        set: function (v) {
            if (!this.p.stateHandler.checkReady.call(this))
                return;

            let newValue = Math.round(parseFloat(v));
            if (newValue < 0) newValue = 0;
            if (newValue > 20) newValue = 20;

            if (isNaN(newValue))
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `food in  <${this.constructor.name}>.food = ${require('util').inspect(newValue)}  `, {
                    got: arguments[0],
                    expectationType: 'type',
                    expectation: 'number'
                }, null, { server: this.server, client: this }));

            const oldValue = this.food;
            this.p._food = newValue;

            this.p.sendPacket('update_health', {
                health: this.health,
                food: newValue,
                foodSaturation: this.foodSaturation
            });

            if (oldValue !== newValue)
                this.p.emitChange('food', oldValue);
        },
        setRaw: function (v) {
            const value = parseInt(v);

            if (isNaN(value) || value < 0 || value > 20)
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `food in  <${this.constructor.name}>.food = ${require('util').inspect(value)}  `, {
                    got: v,
                    expectationType: 'value',
                    expectation: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
                }, null, { server: this.server, client: this }));

            this.p.sendPacket('update_health', {
                health: this.health,
                food: value,
                foodSaturation: this.foodSaturation
            })

            this.p._food = value;
        },
        init: function () {
            this.p._food = 20;
        }
    }
}