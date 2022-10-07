const CustomError = require('../../../../CustomError.js');

module.exports = {
    food: {
        info: {
            callAfterLogin: true
        },
        get: function () {
            return this.p._food
        },
        set: function (v) {
            this.p.stateHandler.checkReady.call(this);

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
            this.p.emitObservable('food');
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