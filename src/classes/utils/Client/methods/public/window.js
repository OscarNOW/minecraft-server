const windowNameIdMapping = require('../../../../../data/static/windowNameIdMapping.json');

module.exports = {
    window: function (windowType, horse) {
        if (!this.p.canUsed)
            if (this.online)
                throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
            else
                throw new Error(`Can't perform this action on an offline player`)

        if (!windowNameIdMapping[windowType]) throw new Error(`Unknown windowType "${windowType}" (${typeof windowType})`)
        if (windowType == 'horse' && !horse) throw new Error(`No horse given`)

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