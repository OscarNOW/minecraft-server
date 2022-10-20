module.exports = {
    sendPacket(name, packet) {
        if (this.p.proxy)
            this.p.proxy.outgoingCallback(this, name, packet);

        this.p.client.write(name, packet);
    }
}