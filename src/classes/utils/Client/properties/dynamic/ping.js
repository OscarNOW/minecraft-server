module.exports = {
    ping: {
        get: function () {
            return this[this.ps.client].latency;
        }
    }
}