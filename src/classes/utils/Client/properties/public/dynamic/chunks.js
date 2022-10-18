let values = new WeakMap();

module.exports = {
    chunks: {
        get: function () {
            if (!values.has(this)) values.set(this, Object.freeze([]));
            return values.get(this);
        },
        setPrivate: function (value) {
            values.set(this, value);
        }
    }
}