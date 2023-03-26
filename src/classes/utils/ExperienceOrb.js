const Entity = require('./Entity.js');

class ExperienceOrb extends Entity {
    constructor(client, type, id, position, sendPacket, extraInfo, overwrites, whenDone) {
        super(client, type, id, position, sendPacket, extraInfo, {
            ...overwrites,
            sendSpawnPacket: false
        }, whenDone);

        if (overwrites.sendSpawnPacket !== false)
            this.p.sendPacket('spawn_entity_experience_orb', {
                entityId: this.id,
                x: this.position.x,
                y: this.position.y,
                z: this.position.z,
                count: this.extraInfo.count
            })
    }
}

module.exports = ExperienceOrb;