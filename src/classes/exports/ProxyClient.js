class ProxyClient {
    constructor() {
        this.events = [];
        this.hooks = [];
    }

    sendPacket(name, packet) {
        for (const { callback } of this.hooks)
            callback(name, packet);
    }

    onPacket(callback) {
        this.events.push({ callback });
    }

    emitPacket(name, packet) {
        for (const { callback } of this.events)
            callback(name, packet);
    }
}

module.exports = ProxyClient;