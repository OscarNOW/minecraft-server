const Entity = require('./Entity');

function sendStartPacket() {
    this.p.sendPacket('named_entity_spawn', {
        entityId: this.id,
        playerUUID: this.playerInfo.uuid,
        x: this.position.x,
        y: this.position.y,
        z: this.position.z,
        yaw: this.position.yaw,
        pitch: this.position.pitch
    });
}

class Player extends Entity {
    constructor(client, type, id, position, sendPacket, tabItem) {
        super(client, type, id, position, sendPacket, {}, { sendSpawnPacket: false });

        this._playerInfo = tabItem; //todo: make really private

        sendStartPacket.call(this);
    }

    get playerInfo() {
        return this._playerInfo;
    }

    set playerInfo(value) {
        this._playerInfo = value;

        this.p.sendPacket('entity_destroy', {
            entityIds: [this.id]
        });

        sendStartPacket.call(this);
    }
}

module.exports = Player;