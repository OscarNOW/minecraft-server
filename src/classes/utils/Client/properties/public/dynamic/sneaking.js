module.exports = {
    sneaking: {
        info: {
            preventSet: true
        },
        get: function () {
            return this.p._sneaking;
        },
        set: function (newValue) {
            const oldValue = this.sneaking;

            this.p._sneaking = newValue;

            if (oldValue !== newValue)
                this.p.emitChange('sneaking', oldValue);
        },
        init: function () {
            this.p._sneaking = false;
        }
    }
}