module.exports = {
    rightHanded: {
        get: function () {
            if (!this.p._rightHanded)
                this.p._rightHanded = null;

            return this.p._rightHanded;
        },
        setPrivate: function (value) {
            this.p._rightHanded = value;
        }
    }
}