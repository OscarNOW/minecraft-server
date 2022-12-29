module.exports = {
    locale: {
        info: {
            preventSet: true
        },
        get: function () {
            return this.p._locale;
        },
        set: function (value) {
            this.p._locale = value;
        },
        init: function () {
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