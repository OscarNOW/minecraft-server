module.exports = {
    bossBars: {
        info: {
            preventSet: true
        },
        get() {
            return this.p.bossBars;
        },
        set(newValue) {
            const oldValue = [...this.bossBars];

            this.p.bossBars = newValue;

            const changed =
                newValue.length !== oldValue.length ||
                newValue.some((a, i) => a !== oldValue[i]);

            if (changed)
                this.p.emitChange('bossBars', oldValue);
        },
        init() {
            this.p.bossBars = Object.freeze([]);
        }
    }
}