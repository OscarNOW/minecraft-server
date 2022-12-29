let values = new WeakMap();

module.exports = {
    sprinting: {
        info: {
            preventSet: true
        },
        get: function () {
            if (!values.has(this)) values.set(this, false);
            return values.get(this);
        },
        set: function (newValue) {
            const oldValue = this.sprinting;

            values.set(this, newValue);

            if (oldValue !== newValue)
                this.p.emitChange('sprinting', oldValue);
        }
    }
}