const { sneaking } = require('../properties/public/dynamic/sneaking.js');
const { sprinting } = require('../properties/public/dynamic/sprinting.js');

module.exports = {
    // entity_action: function ({ entityId, actionId, jumpBoost }) {
    entity_action: function ({ actionId }) {

        //sneaking
        if (actionId === 0)
            sneaking.set.call(this, true);
        else if (actionId === 1)
            sneaking.set.call(this, false);

        //sprinting
        else if (actionId === 3)
            sprinting.set.call(this, true);
        else if (actionId === 4)
            sprinting.set.call(this, false);

        //todo: implement other actions
    }
}