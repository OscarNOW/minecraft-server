module.exports = {
    foodSaturation: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get() {
            return this.p._foodSaturation;
        },
        set(newValue, beforeReady) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            if (typeof newValue !== 'number' || isNaN(newValue) || newValue < 0 || newValue > 5)
                throw new Error(`foodSaturation must be an integer between 0 and 5, received ${newValue} (${typeof newValue})`);

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