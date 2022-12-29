module.exports = {
    brand: {
        info: {
            preventSet: true
        },
        get() {
            return this.p._brand;
        },
        set(value) {
            this.p._brand = value;
        },
        init() {
            this.p._brand = undefined;
        }
    }
}