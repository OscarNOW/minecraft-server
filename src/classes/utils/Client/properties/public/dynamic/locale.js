module.exports = {
    locale: {
        get: function () {
            if (!this.p._locale)
                this.p._locale = Object.freeze({
                    langCode: null,
                    englishName: null,
                    menuName: null,
                    version: null,
                    region: null
                })

            return this.p._locale;
        },
        setPrivate: function (value) {
            this.p._locale = value;
        }
    }
}