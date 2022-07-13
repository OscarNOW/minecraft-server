module.exports = {
    entity_action: function ({ entityId, actionId, jumpBoost }) {
        if (actionId == 0)
            this.sneaking = true;
        else if (actionId == 1)
            this.sneaking = false;
        else { } //Not implemented            
    }
}