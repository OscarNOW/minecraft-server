let values = new WeakMap();

module.exports = {
    bossBars: {
        info: {
            preventSet: true
        },
        get: function () {
            if (!values.has(this)) values.set(this, Object.freeze([]));
            return values.get(this);
        },
        set: function (value) {
            const oldValue = [...value];

            values.set(this, value);

            const changed =
                value.length !== oldValue.length ||
                value.some((a, i) => a !== oldValue[i]);

            if (changed)
                this.p.emitChange('bossBars', oldValue);
        }
    }
}