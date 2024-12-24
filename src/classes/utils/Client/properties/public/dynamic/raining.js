module.exports = {
    raining: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get() {
            return this.p._raining;
        },
        set(newValue, beforeReady) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            if (typeof newValue !== 'boolean')
                throw new Error(`Expected raining to be a boolean, received ${newValue} (${typeof newValue})`);

            const oldValue = this.raining;
            this.p._raining = newValue;

            this.p.sendPacket('game_state_change', {
                reason: 7,
                gameMode: this.raining ? this.toxicRainLevel + 1 : 0
            });

            if ((!beforeReady) && oldValue !== newValue)
                this.p.emitChange('raining', oldValue);
        },
        init() {
            this.p._raining = false;
        }
    }
}