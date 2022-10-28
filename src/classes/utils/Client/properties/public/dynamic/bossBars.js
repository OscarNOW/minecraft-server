let values = new WeakMap();

module.exports = {
    bossBars: {
        get: function () {
            if (!values.has(this)) values.set(this, Object.freeze([]));
            return values.get(this);
        },
        setPrivate: function (value) {
            const changed = value !== this.bossBars;

            values.set(this, value);

            if (changed)
                this.p.emitChange('bossBars');
        }
    }
}