let values = new WeakMap();

module.exports = {
    entities: {
        get: function () {
            if (!values.has(this)) values.set(this, { 0: this });
            return values.get(this);
        }
    }
}