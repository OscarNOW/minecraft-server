const { soundChannels } = require('../../../../../functions/loader/data.js');

const CustomError = require('../../../CustomError.js');

module.exports = {
    sound: function ({ sound, channel, position: { x, y, z }, volume, pitch }) {
        if (!this.p.canUsed)
            if (this.online)
                throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
            else
                throw new Error(`Can't perform this action on an offline player`)

        if (!soundChannels.includes(channel))
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'channel', ''],
                ['in the function "', 'sound', '"'],
                ['in the class ', this.constructor.name, ''],
            ], {
                got: channel,
                expectationType: 'value',
                expectation: soundChannels
            }, this.sound).toString()
        if (typeof volume != 'number' || volume < 0 || volume > 1)
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'volume', ''],
                ['in the function "', 'sound', '"'],
                ['in the class ', this.constructor.name, ''],
            ], {
                got: volume,
                expectationType: 'type',
                expectation: 'number between 0 and 1'
            }, this.sound).toString()

        //Multiplying by 8 is needed, see https://wiki.vg/index.php?title=Protocol&oldid=16091#Sound_Effect
        this.p.sendPacket('named_sound_effect', {
            soundName: sound,
            soundCategory: soundChannels.indexOf(channel),
            x: Math.round(x * 8),
            y: Math.round(y * 8),
            z: Math.round(z * 8),
            volume,
            pitch
        })
    }
}