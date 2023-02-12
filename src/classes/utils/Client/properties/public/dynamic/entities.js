module.exports = {
    entities: {
        info: {
            preventSet: true
        },
        get() {
            return this.p.entities; // todo: add _ before name. For example: this.p._name
        },
        set(newValue) {
            const oldValue = { ...this.entities };

            this.p.entities = newValue;

            const changed =
                Object.keys(oldValue).length !== Object.keys(newValue).length ||
                Object.keys(oldValue).some(key => oldValue[key] !== newValue[key]);

            if (changed)
                this.p.emitChange('entities', oldValue);
        },
        init() {
            this.p.entities = Object.freeze({ 0: this });
        }
    }
}