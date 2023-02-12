module.exports = {
    onGround: {
        info: {
            preventSet: true
        },
        get() {
            return this.p.onGround; // todo: add _ before name? For example: this.p._name
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