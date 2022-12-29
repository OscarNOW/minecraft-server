module.exports = {
    sprinting: {
        info: {
            preventSet: true
        },
        get: function () {
            return this.p._sprinting;
        },
        set: function (newValue) {
            const oldValue = this.sprinting;

            this.p._sprinting = newValue;

            if (oldValue !== newValue)
                this.p.emitChange('sprinting', oldValue);
        },
        init: function () {
            this.p._sprinting = false;
        }
    }
}