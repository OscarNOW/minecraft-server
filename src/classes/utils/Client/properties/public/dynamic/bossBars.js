let values = new WeakMap();

module.exports = {
    bossBars: {
        get: function () {
            if (!values.has(this)) values.set(this, Object.freeze([]));
            return values.get(this);
        },
        set: function (value) {
            values.set(this, value);
        }
    }
}