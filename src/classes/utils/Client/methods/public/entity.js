const Entity = require('../../../Entity.js');
const CustomEntityClasses = Object.fromEntries(
    [
        'Horse'
    ]
        .map(a => [a.toLowerCase(), require(`../../../${a}.js`)]))

const { entities } = require('../../properties/public/dynamic/entities.js');

module.exports = function (type, { x, y, z, yaw, pitch }, extraInformation) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    let entityId = null;
    for (let ii = 1; entityId === null; ii++)
        if (!this.entities[ii])
            entityId = ii;

    const EntityClass = CustomEntityClasses[type] || Entity;
    const entity = new EntityClass(this, type, entityId, { x, y, z, yaw, pitch }, this.p.sendPacket, extraInformation);

    let newEntities = Object.assign({}, this.entities);
    newEntities[entityId] = entity;

    entities.setPrivate.call(this, Object.freeze(newEntities));
    return entity;
}