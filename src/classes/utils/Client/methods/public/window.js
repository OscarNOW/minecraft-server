const { windowNameIdMapping } = require('../../../../../functions/loader/data.js');

const CustomError = require('../../../CustomError.js');

module.exports = function (windowType, horse) {
    this.p.stateHandler.checkReady.call(this);

    if (!windowNameIdMapping[windowType])
        throw new CustomError('expectationNotMet', 'libraryUser', `windowType in  <${this.constructor.name}>.window(${require('util').inspect(windowType)}, ...)  `, {
            got: windowType,
            expectationType: 'value',
            expectation: Object.keys(windowNameIdMapping)
        }, this.window).toString()
    if (windowType == 'horse' && !horse)
        throw new CustomError('expectationNotMet', 'libraryUser', `horse in  <${this.constructor.name}>.window(..., ${require('util').inspect(horse)})  `, {
            got: horse,
            expectationType: 'type',
            expectation: 'Entity',
            externalLink: `{docs}/classes/Entity.html`
        }, this.window).toString()

    let windowId = windowNameIdMapping[windowType];

    if (windowId == 'EntityHorse')
        this.p.sendPacket('open_horse_window', {
            windowId: 1,
            nbSlots: 2,
            entityId: horse.id
        })
    else
        throw new Error(`Not implemented`)
}