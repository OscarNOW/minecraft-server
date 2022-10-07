let values = new WeakMap();

module.exports = {
    entities: {
        get: function () {
            if (!values.has(this)) values.set(this, Object.freeze({ 0: this }));
            return values.get(this);
        },
        setPrivate: function (value) {
            values.set(this, value);
        }
    }
}