module.exports = {
    sendPacket(name, packet) {
        this.p.client.write(name, packet)
    }
}