module.exports = {
    bossBars: {
        info: {
            preventSet: true
        },
        get: function () {
            return this.p.bossBars;
        },
        set: function (newValue) {
            const oldValue = [...this.bossBars];

            this.p.bossBars = newValue;

            const changed =
                newValue.length !== oldValue.length ||
                newValue.some((a, i) => a !== oldValue[i]);

            if (changed)
                this.p.emitChange('bossBars', oldValue);
        },
        init: function () {
            this.p.bossBars = Object.freeze([]);
        }
    }
}