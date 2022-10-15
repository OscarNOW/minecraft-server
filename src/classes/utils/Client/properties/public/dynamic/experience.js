const Changable = require('../../../../Changable.js');

module.exports = {
    experience: {
        info: {
            callAfterLogin: true
        },
        get: function () {
            return this.p._experience;
        },
        set: function ({ bar, level } = {}) {
            if (!this.p.stateHandler.checkReady.call(this))
                return;

            if (bar === undefined) bar = this.experience.bar;
            if (level === undefined) level = this.experience.level;

            let totalLevel = level + bar;
            let totalExperience;

            if (totalLevel >= 0 && totalLevel <= 15)
                totalExperience = Math.pow(totalLevel, 2) + (totalLevel * 6)
            else if (totalLevel >= 16 && totalLevel <= 30)
                totalExperience = (2.5 * Math.pow(totalLevel, 2)) - (40.5 * totalLevel) + 360
            else
                totalExperience = (4.5 * Math.pow(totalLevel, 2)) - (162.5 * totalLevel) + 2220

            this.p.sendPacket('experience', {
                experienceBar: bar,
                level,
                totalExperience
            })

            this.p.emitObservable('experience');
            this.p._experience.setRaw({ bar, level })
        },
        setRaw: function ({ bar, level }) {

            if (bar === undefined) bar = this.experience.bar;
            if (level === undefined) level = this.experience.level;
            if (level === null) level = undefined;

            let totalExperience;

            if (level >= 0 && level <= 15)
                totalExperience = Math.pow(level, 2) + (level * 6)
            else if (level >= 16 && level <= 30)
                totalExperience = (2.5 * Math.pow(level, 2)) - (40.5 * level) + 360
            else
                totalExperience = (4.5 * Math.pow(level, 2)) - (162.5 * level) + 2220

            this.p.sendPacket('experience', {
                experienceBar: bar,
                level,
                totalExperience
            })

            this.p._experience.setRaw({ bar, level })
        },
        init: function () {
            this.p._experience = new Changable((function (i) { this.experience = i }).bind(this), {
                bar: 0,
                level: 0
            })
        }
    }
}