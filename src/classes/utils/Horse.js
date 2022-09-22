const Entity = require('./Entity.js');

class Horse extends Entity {
    window() {
        this.client.p.sendPacket('open_horse_window', {
            windowId: 1,
            nbSlots: 2, //todo: make this customizable
            entityId: this.id
        })
    }
}

module.exports = Horse;