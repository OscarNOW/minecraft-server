const { items } = require('../../../../../functions/loader/data.js');

const CustomError = require('../../../CustomError.js');

module.exports = {
    cooldown: function (item, length = 60) {
        this.p.stateHandler.checkReady.call(this);

        if (!items[item])
            throw new CustomError('expectationNotMet', 'libraryUser', [
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