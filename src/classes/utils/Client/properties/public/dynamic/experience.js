const Changable = require('../../../../Changable.js');

module.exports = {
    experience: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get: function () {
            return this.p._experience;
        },
        set: function ({ bar, level } = {}, beforeReady) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            if (bar === undefined) bar = this.experience.bar;
            if (level === undefined) level = this.experience.level;

            let totalLevel = level + bar;
            let totalExperience;

            if (totalLevel >= 0 && totalLevel <= 15)
                totalExperience = Math.pow(totalLevel, 2) + (totalLevel * 6);
            else if (totalLevel >= 16 && totalLevel <= 30)
                totalExperience = (2.5 * Math.pow(totalLevel, 2)) - (40.5 * totalLevel) + 360;
            else
                totalExperience = (4.5 * Math.pow(totalLevel, 2)) - (162.5 * totalLevel) + 2220;

            const oldValue = this.p._experience.raw;
            this.p._experience.setRaw({ bar, level });

            this.p.sendPacket('experience', {
                experienceBar: bar,
                level,
                totalExperience
            });

            if ((!beforeReady) && level !== oldValue.level || bar !== oldValue.bar)
                this.p.emitChange('experience', oldValue);
        },
        init: function () {
            this.p._experience = new Changable((function (i) { this.experience = i }).bind(this), {
                bar: 0,
                level: 0
            });
        }
    }
}