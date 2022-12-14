const Entity = require('../../../Entity.js');
const CustomEntityClasses = Object.fromEntries(
    [
        'Horse',
        'Player'
    ]
        .map(a => [a.toLowerCase(), require(`../../../${a}.js`)]));

const AsyncEntityClasses = Object.freeze([
    'Player'
]);

const { entities } = require('../../properties/public/dynamic/entities.js');

module.exports = function (type, { x, y, z, yaw, pitch }, extraInformation) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    let entityId = null;
    for (let ii = 1; entityId === null; ii++)
        if (!this.entities[ii])
            entityId = ii;

    const EntityClass = CustomEntityClasses[type] || Entity;

    const afterEntityCreation = entity => {
        let newEntities = Object.assign({}, this.entities);
        newEntities[entityId] = entity;

        entities.setPrivate.call(this, Object.freeze(newEntities));
    };

    if (AsyncEntityClasses.includes(type))
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