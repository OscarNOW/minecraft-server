const { items } = require('../../../../../functions/loader/data.js');

const CustomError = require('../../../CustomError.js');

module.exports = function (item, length = 60) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    if (!items.find(({ name }) => name === item))
        this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `item in  <${this.constructor.name}>.cooldown(${require('util').inspect(item)}, ...)  `, {
            got: item,
            expectationType: 'type',
            expectation: 'itemName',
            externalLink: '{docs}/types/itemName'
        }, this.cooldown, { server: this.server, client: this }));

    this.p.sendPacket('set_cooldown', {
        itemID: items.find(({ name }) => name === item).id,
        cooldownTicks: length
    })
}