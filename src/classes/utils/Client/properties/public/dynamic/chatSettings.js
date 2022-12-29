module.exports = {
    chatSettings: {
        info: {
            preventSet: true
        },
        get: function () {
            return this.p._chatSettings;
        },
        set: function (value) {
            this.p._chatSettings = value;
        },
        init: function () {
            this.p._chatSettings = Object.freeze({
                visible: null,
                colors: null
            });
        }
    }
}