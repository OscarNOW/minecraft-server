let values = new WeakMap();

module.exports = {
    entities: {
        get: function () {
            if (!values.has(this)) values.set(this, Object.freeze({ 0: this }));
            return values.get(this);
        },
        setPrivate: function (value) {
            const oldValue = [...this.entities];

            values.set(this, value);

            const changed =
                Object.keys(value).length !== Object.keys(oldValue).length ||
                Object.keys(value).some(key => value[key] !== oldValue[key]);

            if (changed)
                this.p.emitChange('entities', oldValue);
        }
    }
}