module.exports = {
    viewDistance: {
        get: function () {
            if (!this.p._viewDistance)
                this.p._viewDistance = null;

            return this.p._viewDistance;
        },
        setPrivate: function (value) {
            this.p._viewDistance = value;
        }
    }
}