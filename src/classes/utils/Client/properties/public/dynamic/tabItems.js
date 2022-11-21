let values = new WeakMap();

module.exports = {
    tabItems: {
        get: function () {
            if (!values.has(this)) values.set(this, Object.freeze([]));
            return values.get(this);
        },
        setPrivate: function (value) {
            const changed =
                value.length !== this.tabItems.length ||
                value.some((a, i) => a !== this.tabItems[i]);

            values.set(this, value);

            if (changed)
                this.p.emitChange('tabItems');
        }
    }
}