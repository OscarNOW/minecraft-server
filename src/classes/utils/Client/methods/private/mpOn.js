let noPacketEvents = ['end'];

module.exports = {
    mpOn(name, callback) {
        if (!this.p.mpEvents) this.p.mpEvents = {};
        if (!this.p.mpEvents[name]) this.p.mpEvents[name] = [];

        if (noPacketEvents.includes(name))
            this.p.client.on(name, (...args) => this.p.receivePacket(name, ...args));

        this.p.mpEvents[name].push({ callback });
    }
}