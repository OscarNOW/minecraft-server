let values = new WeakMap();

module.exports = {
    sneaking: {
        get: function () {
            if (!values.has(this)) values.set(this, false);
            return values.get(this);
        },
        setPrivate: function (newValue) {
            let oldValue = this.sneaking;

            values.set(this, newValue);

            if (oldValue != newValue)
                this.p.emitChange('sneaking');
        }
    }
}