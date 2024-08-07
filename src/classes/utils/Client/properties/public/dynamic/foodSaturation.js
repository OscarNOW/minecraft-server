const CustomError = require('../../../../CustomError.js');

module.exports = {
    foodSaturation: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get() {
            return this.p._foodSaturation;
        },
        set(v, beforeReady) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            let newValue = parseInt(v);
            if (newValue < 0) newValue = 0;
            if (newValue > 5) newValue = 5;

            if (isNaN(newValue))
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `foodSaturation in  <${this.constructor.name}>.foodSaturation = ${require('util').inspect(newValue)}  `, {
                    got: v,
                    expectationType: 'value',
                    expectation: [0, 1, 2, 3, 4, 5]
                }, null, { server: this.server, client: this }));

            const oldValue = this.foodSaturation;
            this.p._foodSaturation = newValue;

            this.p.sendPacket('update_health', {
                health: this.health,
                food: this.food,
                foodSaturation: this.foodSaturation
            });

            if ((!beforeReady) && oldValue !== newValue)
                this.p.emitChange('foodSaturation', oldValue);
        },
        init() {
            this.p._foodSaturation = 5;
        }
    }
}