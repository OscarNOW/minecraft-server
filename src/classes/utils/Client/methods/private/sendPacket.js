module.exports = {
    sendPacket(name, packet) {
        if (name === 'login')
            console.log(name, packet)

        this.p.client.write(name, packet);
    }
}