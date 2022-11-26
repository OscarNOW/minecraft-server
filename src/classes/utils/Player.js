const Entity = require('./Entity');

class Player extends Entity {
    constructor(client, type, id, position, sendPacket, tabItem) {
        super(client, type, id, position, sendPacket, {}, { sendSpawnPacket: false });

        this.playerInfo = tabItem;

        this.p.sendPacket('named_entity_spawn', {
            entityId: this.id,
            playerUUID: tabItem.uuid,
            x: this.position.x,
            y: this.position.y,
            z: this.position.z,
            yaw: this.position.yaw,
            pitch: this.position.pitch
        })
    }
}

module.exports = Player;