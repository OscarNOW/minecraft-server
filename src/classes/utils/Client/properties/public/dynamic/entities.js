let values = new WeakMap();

module.exports = {
    entities: {
        get: function () {
            if (!values.has(this)) values.set(this, Object.freeze({ 0: this }));
            return values.get(this);
        },
        setPrivate: function (value) {
            const oldValue = [...this.entities];

            const changed =
                Object.keys(value).length !== Object.keys(this.entities).length ||
                Object.keys(value).some(key => value[key] !== this.entities[key]);

            values.set(this, value);

            if (changed)
                this.p.emitChange('entities', oldValue);
        }
    }
}