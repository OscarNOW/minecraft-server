module.exports = {
    rightHanded: {
        info: {
            preventSet: true
        },
        get() {
            return this.p._rightHanded;
        },
        set(value) {
            this.p._rightHanded = value;
        },
        init() {
            this.p._rightHanded = null;
        }
    }
}