const { items } = require('../../../../../functions/loader/data.js');

const CustomError = require('../../../CustomError.js');

module.exports = function (item, length = 60) {
    this.p.stateHandler.checkReady.call(this);

    if (!items[item])
        throw new CustomError('expectationNotMet', 'libraryUser', `item in  <${this.constructor.name}>.cooldown(${require('util').inspect(item)}, ...)  `, {
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