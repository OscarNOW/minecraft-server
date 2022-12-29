module.exports = {
    chatSettings: {
        info: {
            preventSet: true
        },
        get() {
            return this.p._chatSettings;
        },
        set(value) {
            this.p._chatSettings = value;
        },
        init() {
            this.p._chatSettings = Object.freeze({
                visible: null,
                colors: null
            });
        }
    }
}