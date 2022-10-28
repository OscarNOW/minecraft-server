let values = new WeakMap();

module.exports = {
    chunks: {
        get: function () {
            if (!values.has(this)) values.set(this, Object.freeze([]));
            return values.get(this);
        },
        setPrivate: function (value) {
            const changed =
                value.length !== this.chunks.length ||
                value.some((a, i) => a !== this.chunks[i]);

            values.set(this, value);

            if (changed)
                this.p.emitChange('chunks');
        }
    }
}