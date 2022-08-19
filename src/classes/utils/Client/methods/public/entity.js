const Entity = require('../../../Entity.js');

module.exports = {
    entity: function (type, { x, y, z, yaw, pitch }) {
        this.p.stateHandler.checkReady.call(this);

        let entityId = null;
        for (let ii = 1; entityId === null; ii++)
            if (!this.entities[ii])
                entityId = ii;

        let entity = new Entity(this, type, entityId, { x, y, z, yaw, pitch }, this.p.sendPacket);

        this.entities[entityId] = entity;
        return entity;
    }
}