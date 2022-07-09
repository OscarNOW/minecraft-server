const { soundChannels } = require('../../../../../functions/loader/data.js');

const { CustomError } = require('../../../CustomError.js');

module.exports = {
    stopSounds: function ({ soundName, channel } = {}) {
        if (!this.p.canUsed)
            if (this.online)
                throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
            else
                throw new Error(`Can't perform this action on an offline player`)

        if (channel && !soundChannels.includes(channel))
                /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'libraryUser', [
                    ['', 'channel', ''],
                    ['in the function "', 'sound', '"'],
                    ['in the class ', this.constructor.name, ''],
                ], {
                    got: channel,
                    expectationType: 'value',
                    expectation: [undefined, ...soundChannels]
                }, this.sound).toString()

        if (soundName && typeof soundName != 'string')
                /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'libraryUser', [
                    ['', 'customSoundName', ''],
                    ['in the function "', 'sound', '"'],
                    ['in the class ', this.constructor.name, ''],
                ], {
                    got: soundName,
                    expectationType: 'type',
                    expectation: "undefined | string"
                }, this.sound).toString()

        this.p.sendPacket('stop_sound', {
            flags: channel ? (soundName ? 3 : 1) : (soundName ? 2 : 1),
            source: channel ? soundChannels.indexOf(channel) : undefined,
            sound: soundName ?? undefined
        })
    }
}