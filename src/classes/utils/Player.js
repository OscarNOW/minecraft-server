console.log('Not implemented'); // not implemented

// const Entity = require('./Entity.js');


// const _p = Symbol('private');
// const defaultPrivate = {
//     parseProperty: function (key, value) {
//         return value;
//     },
//     parseProperties: function (properties) {
//         for (const [key, value] of Object.entries(properties))
//             properties[key] = this.p.parseProperty.call(this, key, value);

//         return properties;
//     },
//     updateProperty: function (name) {
//         if (!this.client.p.stateHandler.checkReady.call(this.client))
//             return;
//     }
// };

// class Player extends Entity {
//     constructor(client, type, id, position, sendPacket, extraInfo) {
//         super(type, id, position, sendPacket, extraInfo);
//     }
// }

// module.exports = Player;