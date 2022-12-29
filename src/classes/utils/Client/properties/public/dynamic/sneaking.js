module.exports = {
    sneaking: {
        info: {
            preventSet: true
        },
        get() {
            return this.p._sneaking;
        },
        set(newValue) {
            const oldValue = this.sneaking;

            this.p._sneaking = newValue;

            if (oldValue !== newValue)
                this.p.emitChange('sneaking', oldValue);
        },
        init() {
            this.p._sneaking = false;
        }
    }
}