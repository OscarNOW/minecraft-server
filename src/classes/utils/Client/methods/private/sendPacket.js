module.exports = {
    sendPacket(name, packet) {
        if (name === 'player_info')
            console.log(packet.data[0])

        this.p.client.write(name, packet);
    }
}