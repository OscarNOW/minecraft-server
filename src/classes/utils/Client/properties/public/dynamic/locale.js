module.exports = {
    locale: {
        info: {
            preventSet: true
        },
        get() {
            return this.p._locale;
        },
        set(value) {
            this.p._locale = value;
        },
        init() {
            this.p._locale = Object.freeze({
                langCode: null,
                englishName: null,
                menuName: null,
                version: null,
                region: null
            });
        }
    }
}