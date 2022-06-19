module.exports = {
    ping: {
        get: function () {
            return this.p.client.latency;
        }
    }
}