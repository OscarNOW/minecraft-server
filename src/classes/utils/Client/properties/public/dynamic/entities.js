module.exports = {
    entities: {
        info: {
            preventSet: true
        },
        get: function () {
            return this.p.entities;
        },
        set: function (newValue) {
            const oldValue = { ...this.entities };

            this.p.entities = newValue;

            const changed =
                Object.keys(oldValue).length !== Object.keys(newValue).length ||
                Object.keys(oldValue).some(key => oldValue[key] !== newValue[key]);

            if (changed)
                this.p.emitChange('entities', oldValue);
        },
        init: function () {
            this.p.entities = Object.freeze({ 0: this });
        }
    }
}