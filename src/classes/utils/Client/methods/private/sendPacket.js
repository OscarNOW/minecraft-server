module.exports = {
    sendPacket(name, packet) {
        // if (['entity_destroy', 'named_entity_spawn', 'player_info'].includes(name))
        //     console.log(name, require('util').inspect(packet, { depth: 100, colors: true }))

        this.p.client.write(name, packet);
    }
}