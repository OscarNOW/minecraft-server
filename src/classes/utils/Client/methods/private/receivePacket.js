module.exports = {
    receivePacket(name, packet) {
        if (this.p.mpEvents?.[name])
            for (const { callback } of this.p.mpEvents[name])
                callback(packet);
    }
}