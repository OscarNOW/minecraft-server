let values = new WeakMap();

module.exports = {
    sneaking: {
        info: {
            preventSet: true
        },
        get: function () {
            if (!values.has(this)) values.set(this, false);
            return values.get(this);
        },
        set: function (newValue) {
            const oldValue = this.sneaking;

            values.set(this, newValue);

            if (oldValue !== newValue)
                this.p.emitChange('sneaking', oldValue);
        }
    }
}