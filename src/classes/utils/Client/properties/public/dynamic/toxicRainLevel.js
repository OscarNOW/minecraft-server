module.exports = {
    toxicRainLevel: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get() {
            return this.p._toxicRainLevel;
        },
        set(newValue, beforeReady) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            if (typeof newValue !== 'number' || isNaN(newValue) || newValue < 0)
                throw new Error(`toxicRainLevel must be a number bigger than 0, received ${newValue} (${typeof newValue})`);

            const oldValue = this.toxicRainLevel;
            this.p._toxicRainLevel = newValue;

            if (this.raining)
                this.p.sendPacket('game_state_change', {
                    reason: 7,
                    gameMode: this.toxicRainLevel + 1
                });

            if ((!beforeReady) && oldValue !== newValue)
                this.p.emitChange('toxicRainLevel', oldValue);
        },
        init() {
            this.p._toxicRainLevel = 0;
        }
    }
}