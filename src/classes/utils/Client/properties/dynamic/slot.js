module.exports = {
    slot: {
        get: function () {
            return this[this.ps._slot]
        },
        set: function (slot) {
            if (!this[this.ps.canUsed])
                throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

            if (isNaN(parseInt(slot)) || slot < 0 || slot > 8)
                throw new Error(`Unknown slot, expected an integer between 0 and 8, received "${slot}" (${typeof slot})`)

            this[this.ps.sendPacket]('held_item_slot', {
                slot: parseInt(slot)
            })
        }
    }
}