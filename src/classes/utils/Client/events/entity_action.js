module.exports = {
    entity_action: function ({ entityId, actionId, jumpBoost }) {
        if (actionId == 0)
            require('../properties/public/dynamic/sneaking.js').setPrivate.call(this, true);
        else if (actionId == 1)
            require('../properties/public/dynamic/sneaking.js').setPrivate.call(this, false);
        else { } //Not implemented            
    }
}