module.exports = {
    sendPacket(name, packet) {
        if (['entity_destroy', 'named_entity_spawn', 'player_info'].includes(name))
            console.log(name, packet)

        this.p.client.write(name, packet);
    }
}