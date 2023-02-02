const CustomError = require('../../../../CustomError.js');

module.exports = {
    health: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get() {
            return this.p._health;
        },
        set(v, beforeReady) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            let newValue = Math.round(parseFloat(v));
            if (newValue < 0) newValue = 0;
            if (newValue > 20) newValue = 20;

            if (Number.isNaN(newValue))
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `health in  <${this.constructor.name}>.health = ${require('util').inspect(newValue)}  `, {
                    got: arguments[0],
                    expectationType: 'type',
                    expectation: 'number'
                }, null, { server: this.server, client: this }));

            const oldValue = this.health;
            this.p._health = newValue;

            this.p.sendPacket('update_health', {
                health: this.health,
                food: this.food,
                foodSaturation: this.foodSaturation
            });

            if ((!beforeReady) && oldValue !== newValue)
                this.p.emitChange('health', oldValue);
        },
        init() {
            this.p._health = 20;
        }
    }
}