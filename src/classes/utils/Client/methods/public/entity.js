const { Entity } = require('../../../Entity.js');

module.exports = {
    entity: function (type, { x, y, z, yaw, pitch }) {
        if (!this.p.canUsed)
            if (this.online)
                throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
            else
                throw new Error(`Can't perform this action on an offline player`)

        let entityId = null;
        for (let ii = 1; entityId === null; ii++)
            if (!this.entities[ii])
                entityId = ii;

        let entity = new Entity(this, type, entityId, { x, y, z, yaw, pitch }, this.p.sendPacket);

        this.entities[entityId] = entity;
        return entity;
    }
}