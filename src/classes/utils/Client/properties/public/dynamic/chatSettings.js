module.exports = {
    chatSettings: {
        info: {
            preventSet: true
        },
        get: function () {
            if (!this.p._chatSettings)
                this.p._chatSettings = Object.freeze({
                    visible: null,
                    colors: null
                });

            return this.p._chatSettings;
        },
        set: function (value) {
            this.p._chatSettings = value;
        }
    }
}