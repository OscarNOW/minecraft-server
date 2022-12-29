module.exports = {
    tabItems: {
        info: {
            preventSet: true
        },
        get: function () {
            return this.p._tabItems;
        },
        set: function (newValue) {
            const oldValue = [...this.tabItems];

            this.p._tabItems = newValue;

            const changed =
                newValue.length !== oldValue.length ||
                newValue.some((a, i) => a !== oldValue[i]);

            if (changed)
                this.p.emitChange('tabItems', oldValue);
        },
        init: function () {
            this.p._tabItems = Object.freeze([]);
        }
    }
}