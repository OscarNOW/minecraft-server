const items = require('../../../../../data/items.json');

module.exports = {
    cooldown: function (item, length = 60) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (!items[item])
            throw new Error(`Unknown item "${item}" (${typeof item})`)

        this[this.ps.sendPacket]('set_cooldown', {
            itemID: items[item].id,
            cooldownTicks: length
        })
    }
}