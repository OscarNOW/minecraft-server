module.exports = {
    rightHanded: {
        info: {
            preventSet: true
        },
        get: function () {
            return this.p._rightHanded;
        },
        set: function (value) {
            this.p._rightHanded = value;
        },
        init: function () {
            this.p._rightHanded = null;
        }
    }
}