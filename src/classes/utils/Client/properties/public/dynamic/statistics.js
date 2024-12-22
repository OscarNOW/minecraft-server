const CustomError = require('../../../../CustomError.js');

module.exports = {
    statistics: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get() {
            return this.p._statistics;
        },
        set(newValue, beforeReady) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            const oldValue = JSON.parse(JSON.stringify(this.statistics));
            this.p._statistics = newValue;

            if (!beforeReady)
                this.p.emitChange('statistics', oldValue);
        },
        init() {
            this.p._statistics = [];
            this.p.clientStatistics = [];
        }
    }
}