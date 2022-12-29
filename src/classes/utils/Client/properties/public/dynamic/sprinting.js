module.exports = {
    sprinting: {
        info: {
            preventSet: true
        },
        get() {
            return this.p._sprinting;
        },
        set(newValue) {
            const oldValue = this.sprinting;

            this.p._sprinting = newValue;

            if (oldValue !== newValue)
                this.p.emitChange('sprinting', oldValue);
        },
        init() {
            this.p._sprinting = false;
        }
    }
}