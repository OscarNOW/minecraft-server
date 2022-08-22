const { soundChannels } = require('../../../../../functions/loader/data.js');

const CustomError = require('../../../CustomError.js');

module.exports = function ({ soundName, channel } = {}) {
    this.p.stateHandler.checkReady.call(this);

    if (channel && !soundChannels.includes(channel))
        throw new CustomError('expectationNotMet', 'libraryUser', `channel in  <${this.constructor.name}>.stopSound({ channel: ${require('util').inspect(channel)} })  `, {
            got: channel,
            expectationType: 'value',
            expectation: [undefined, ...soundChannels]
        }, this.sound).toString()

    if (soundName && typeof soundName != 'string')
        throw new CustomError('expectationNotMet', 'libraryUser', `soundName in  <${this.constructor.name}>.stopSound({ soundName: ${require('util').inspect(soundName)} })  `, {
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