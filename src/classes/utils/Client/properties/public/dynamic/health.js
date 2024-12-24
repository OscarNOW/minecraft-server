module.exports = {
    health: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get() {
            return this.p._health;
        },
        set(newValue, beforeReady) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            if (typeof newValue !== 'number' || isNaN(newValue) || newValue < 0 || newValue > 20)
                throw new Error(`health must be an integer between 0 and 20, received ${newValue} (${typeof newValue})`);

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