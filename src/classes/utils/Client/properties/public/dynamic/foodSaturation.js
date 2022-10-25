const CustomError = require('../../../../CustomError.js');

module.exports = {
    foodSaturation: {
        info: {
            callAfterLogin: true
        },
        get: function () {
            return this.p._foodSaturation
        },
        set: function (v) {
            if (!this.p.stateHandler.checkReady.call(this))
                return;

            const value = parseInt(v);

            if (isNaN(value) || value < 0 || value > 5)
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `foodSaturation in  <${this.constructor.name}>.foodSaturation = ${require('util').inspect(value)}  `, {
                    got: v,
                    expectationType: 'value',
                    expectation: [0, 1, 2, 3, 4, 5]
                }, null, { server: this.server, client: this }));

            const changed = value !== this.foodSaturation;

            this.p.sendPacket('update_health', {
                health: this.p._health,
                food: this.p._food,
                foodSaturation: value
            })

            this.p._foodSaturation = value;
            if (changed)
                this.p.emitChange('foodSaturation');
        },
        setRaw(v) {
            const value = parseInt(v);

            if (isNaN(value) || value < 0 || value > 5)
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `foodSaturation in  <${this.constructor.name}>.foodSaturation = ${require('util').inspect(value)}  `, {
                    got: v,
                    expectationType: 'value',
                    expectation: [0, 1, 2, 3, 4, 5]
                }, null, { server: this.server, client: this }));

            this.p.sendPacket('update_health', {
                health: this.p._health,
                food: this.p._food,
                foodSaturation: value
            })

            this.p._foodSaturation = value;
        },
        init: function () {
            this.p._foodSaturation = 5;
        }
    }
}