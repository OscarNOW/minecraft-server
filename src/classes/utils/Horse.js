const Entity = require('./Entity.js');

class Horse extends Entity {
    window() {
        const windowId = 1;

        this.client.p.sendPacket('open_horse_window', {
            windowId,
            nbSlots: 2, //todo: make this customizable
            entityId: this.id
        })

        this.p.windowId = windowId;
    }
}

module.exports = Horse;