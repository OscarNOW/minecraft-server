module.exports = {
    brand: {
        info: {
            preventSet: true
        },
        get: function () {
            return this.p._brand;
        },
        set: function (value) {
            this.p._brand = value;
        },
        init: function () {
            this.p._brand = undefined;
        }
    }
}