module.exports = {
    ping: {
        get() {
            return this.p.client.latency;
        }
    }
}