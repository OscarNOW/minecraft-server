module.exports = {
    viewDistance: {
        info: {
            preventSet: true
        },
        get() {
            return this.p._viewDistance;
        },
        set(value) {
            this.p._viewDistance = value;
        },
        init() {
            this.p._viewDistance = null;
        }
    }
}