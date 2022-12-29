let values = new WeakMap();

module.exports = {
    tabItems: {
        info: {
            preventSet: true
        },
        get: function () {
            if (!values.has(this)) values.set(this, Object.freeze([]));
            return values.get(this);
        },
        set: function (newValue) {
            const oldValue = [...this.tabItems];

            values.set(this, newValue);

            const changed =
                newValue.length !== oldValue.length ||
                newValue.some((a, i) => a !== oldValue[i]);

            if (changed)
                this.p.emitChange('tabItems', oldValue);
        }
    }
}