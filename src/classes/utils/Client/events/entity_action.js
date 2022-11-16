module.exports = {
    // entity_action: function ({ entityId, actionId, jumpBoost }) {
    entity_action: function ({ actionId }) {

        //sneaking
        if (actionId === 0)
            require('../properties/public/dynamic/sneaking.js').sneaking.setPrivate.call(this, true);
        else if (actionId === 1)
            require('../properties/public/dynamic/sneaking.js').sneaking.setPrivate.call(this, false);

        //sprinting
        else if (actionId === 3)
            require('../properties/public/dynamic/sprinting.js').sprinting.setPrivate.call(this, true);
        else if (actionId === 4)
            require('../properties/public/dynamic/sprinting.js').sprinting.setPrivate.call(this, false);

        //todo: implement other actions
    }
}