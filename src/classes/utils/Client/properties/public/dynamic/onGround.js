module.exports = {
    onGround: {
        info: {
            preventSet: true
        },
        get: function () {
            return this.p.onGround;
        },
        set: function (newValue) {
            const oldValue = this.onGround;

            this.p.onGround = newValue;

            if (oldValue !== newValue)
                this.p.emitChange('onGround', oldValue);
        },
        init: function () {
            this.p.onGround = false;
        }
    }
}