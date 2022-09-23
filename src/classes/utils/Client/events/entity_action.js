module.exports = {
    entity_action: function ({ entityId, actionId, jumpBoost }) {
        if (actionId == 0)
            require('../properties/public/dynamic/sneaking.js').sneaking.setPrivate.call(this, true);
        else if (actionId == 1)
            require('../properties/public/dynamic/sneaking.js').sneaking.setPrivate.call(this, false);
        else { } //Not implemented            
    }
}