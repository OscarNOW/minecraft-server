const Entity = require('./Entity.js');
const defaultExperience = require('../../settings.json').defaults.experienceOrb.experience;

class ExperienceOrb extends Entity {
    constructor(client, type, id, position, sendPacket, extraInfo, overwrites = {}, whenDone) {
        super(client, type, id, position, sendPacket, extraInfo, {
            ...overwrites,
            sendSpawnPacket: false
        }, whenDone);

        const experience = extraInfo.experience ?? defaultExperience;

        if (overwrites.sendSpawnPacket !== false)
            this.p.sendPacket('spawn_entity_experience_orb', {
                entityId: this.id,
                x: this.position.x,
                y: this.position.y,
                z: this.position.z,
                count: experience
            })
    }
}

module.exports = ExperienceOrb;