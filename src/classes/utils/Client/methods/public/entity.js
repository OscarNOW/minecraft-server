const Entity = require('../../../Entity.js');
const customEntityClasses = Object.fromEntries(
    [
        ['horse', 'Horse'],
        ['player', 'Player'],
        ['experience_orb', 'ExperienceOrb']
    ]
        .map(([minecraftName, className]) => [minecraftName, require(`../../../${className}.js`)]));

const asyncEntityClasses = [
    'player'
];

const { entities } = require('../../properties/public/dynamic/entities.js');

module.exports = function (type, { x, y, z, yaw, pitch } = {}, extraInformation) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    let entityId = null;
    for (let ii = 1; entityId === null; ii++) //generate a new entityId thats not already used in this.entities
        if (!this.entities[ii])
            entityId = ii;

    const EntityClass = customEntityClasses[type] || Entity;

    const afterEntityCreation = entity => {
        let newEntities = Object.assign({}, this.entities);
        newEntities[entityId] = entity;

        entities.set.call(this, Object.freeze(newEntities));
    };

    if (asyncEntityClasses.includes(type))
        return (async () => {
            const entity = await new Promise(res =>
                new EntityClass(this, type, entityId, { x, y, z, yaw, pitch }, this.p.sendPacket, extraInformation, undefined, res)
            );
            afterEntityCreation(entity);
            return entity;
        })();
    else {
        const entity = new EntityClass(this, type, entityId, { x, y, z, yaw, pitch }, this.p.sendPacket, extraInformation);
        afterEntityCreation(entity);
        return entity;
    }
}