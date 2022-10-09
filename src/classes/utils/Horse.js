const Entity = require('./Entity.js');

class Horse extends Entity {
    window() {
        const windowId = 1; //could be anything except 0, because that's the id for inventory

        this.client.p.sendPacket('open_horse_window', {
            windowId,
            nbSlots: 2, //todo: make this customizable
            entityId: this.id
        })

        this.client.p.windowId = windowId;
    }
}

module.exports = Horse;