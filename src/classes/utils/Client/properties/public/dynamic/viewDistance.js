module.exports = {
    viewDistance: {
        info: {
            preventSet: true
        },
        get: function () {
            return this.p._viewDistance;
        },
        set: function (value) {
            this.p._viewDistance = value;
        },
        init: function () {
            this.p._viewDistance = null;
        }
    }
}