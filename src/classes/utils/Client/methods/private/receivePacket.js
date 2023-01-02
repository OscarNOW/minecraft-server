module.exports = {
    receivePacket(name, packet) {
        console.log(name)

        if (this.p.mpEvents?.[name])
            for (const { callback } of this.p.mpEvents[name])
                callback(packet);
    }
}