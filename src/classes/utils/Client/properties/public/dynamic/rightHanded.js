module.exports = {
    rightHanded: {
        info: {
            preventSet: true
        },
        get: function () {
            if (!this.p._rightHanded)
                this.p._rightHanded = null;

            return this.p._rightHanded;
        },
        set: function (value) {
            this.p._rightHanded = value;
        }
    }
}