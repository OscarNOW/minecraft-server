module.exports = {
    sendPacket: function (name, packet) {
        this.p.client.write(name, packet)
    }
}