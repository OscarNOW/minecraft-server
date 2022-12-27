let values = new WeakMap();

module.exports = {
    onGround: {
        get: function () {
            if (!values.has(this)) values.set(this, false);
            return values.get(this);
        },
        setPrivate: function (newValue) {
            const oldValue = this.onGround;

            values.set(this, newValue);

            if (oldValue !== newValue)
                this.p.emitChange('onGround', oldValue);
        }
    }
}