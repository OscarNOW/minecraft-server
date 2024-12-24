const { difficulties } = require('../../../../../../functions/loader/data.js');

module.exports = {
    difficulty: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get() {
            return this.p._difficulty;
        },
        set(newValue, beforeReady) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            if (!difficulties.includes(newValue))
                throw new Error(`Unknown difficulty "${newValue}"`);

            const oldValue = this.difficulty;
            this.p._difficulty = newValue;

            this.p.sendPacket('difficulty', {
                difficulty: difficulties.findIndex(x => x === this.difficulty),
                difficultyLocked: true
            });

            if ((!beforeReady) && oldValue !== newValue)
                this.p.emitChange('difficulty', oldValue);
        },
        init() {
            this.p._difficulty = 'normal';
        }
    }
}