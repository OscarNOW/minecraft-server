const { items } = require('../../../../../functions/loader/data.js');

const { CustomError } = require('../../../CustomError.js');

module.exports = {
    cooldown: function (item, length = 60) {
        if (!this.p.canUsed)
            if (this.online)
                throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
            else
                throw new Error(`Can't perform this action on an offline player`)

        if (!items[item])
                /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'libraryUser', [
                    ['', 'item', ''],
                    ['in the function "', 'cooldown', '"'],
                    ['in the class ', this.constructor.name, ''],
                ], {
                    got: item,
                    expectationType: 'type',
                    expectation: 'itemType',
                    externalLink: '{docs}/types/itemType.html'
                }, this.cooldown).toString()

        this.p.sendPacket('set_cooldown', {
            itemID: items[item].id,
            cooldownTicks: length
        })
    }
}