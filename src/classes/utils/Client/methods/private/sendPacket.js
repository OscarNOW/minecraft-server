module.exports = {
    sendPacket: function (name, packet) {
        console.log(name, packet)

        this.p.client.write(name, packet)
    }
}