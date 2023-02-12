module.exports = {
    bossBars: {
        info: {
            preventSet: true
        },
        get() {
            return this.p.bossBars; // todo: add _ before name. For example: this.p._name
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