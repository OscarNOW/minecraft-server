module.exports = {
    onGround: {
        info: {
            preventSet: true
        },
        get() {
            return this.p.onGround;
        },
        set(newValue) {
            const oldValue = this.onGround;

            this.p.onGround = newValue;

            if (oldValue !== newValue)
                this.p.emitChange('onGround', oldValue);
        },
        init() {
            this.p.onGround = false;
        }
    }
}