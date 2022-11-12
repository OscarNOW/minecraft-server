const Entity = require('./Entity.js');

const events = Object.freeze([
    'steer'
]);

class Boat extends Entity {
    constructor(client, type, id, position, sendPacket) {
        super(client, type, id, position, sendPacket);

        this.p.events = {
            ...this.p.events,
            ...Object.fromEntries(events.map(a => [a, []]))
        }
    }
}

module.exports = Boat;