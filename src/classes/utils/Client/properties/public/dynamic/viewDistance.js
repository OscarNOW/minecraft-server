module.exports = {
    viewDistance: {
        info: {
            preventSet: true
        },
        get: function () {
            if (!this.p._viewDistance)
                this.p._viewDistance = null;

            return this.p._viewDistance;
        },
        set: function (value) {
            this.p._viewDistance = value;
        }
    }
}