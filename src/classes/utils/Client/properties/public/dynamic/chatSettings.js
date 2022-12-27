module.exports = {
    chatSettings: {
        get: function () {
            if (!this.p._chatSettings)
                this.p._chatSettings = Object.freeze({
                    visible: null,
                    colors: null
                });

            return this.p._chatSettings;
        },
        setPrivate: function (value) {
            this.p._chatSettings = value;
        }
    }
}