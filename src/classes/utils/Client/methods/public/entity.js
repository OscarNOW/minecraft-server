const Entity = require('../../../Entity.js');
const CustomEntityClasses = Object.fromEntries(
    [
        'Horse'
    ]
        .map(a => [a.toLowerCase(), require(`../../../${a}.js`)]))

module.exports = function (type, { x, y, z, yaw, pitch }) {
    this.p.stateHandler.checkReady.call(this);

    let entityId = null;
    for (let ii = 1; entityId === null; ii++)
        if (!this.entities[ii])
            entityId = ii;

    const entityClass = CustomEntityClasses[type] || Entity;

    let entity = new entityClass(this, type, entityId, { x, y, z, yaw, pitch }, this.p.sendPacket);

    this.entities[entityId] = entity;
    return entity;
}