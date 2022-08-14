const { windowNameIdMapping } = require('../../../../../functions/loader/data.js');

const { CustomError } = require('../../../CustomError.js');

module.exports = {
    window: function (windowType, horse) {
        if (!this.p.canUsed)
            if (this.online)
                throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
            else
                throw new Error(`Can't perform this action on an offline player`)

        if (!windowNameIdMapping[windowType])
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'windowType', ''],
                ['in the function "', 'title', '"'],
                ['in the class ', this.constructor.name, ''],
            ], {
                got: windowType,
                expectationType: 'value',
                expectation: Object.keys(windowNameIdMapping)
            }, this.window).toString()
        if (windowType == 'horse' && !horse)
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'horse', ''],
                ['in the function "', 'title', '"'],
                ['in the class ', this.constructor.name, ''],
            ], {
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
}