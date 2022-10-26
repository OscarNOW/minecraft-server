const { soundChannels } = require('../../../../../functions/loader/data.js');

const CustomError = require('../../../CustomError.js');

module.exports = function ({ soundName, channel } = {}) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    if (channel && !soundChannels.includes(channel))
        this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `channel in  <${this.constructor.name}>.stopSound({ channel: ${require('util').inspect(channel)} })  `, {
            got: channel,
            expectationType: 'value',
            expectation: [undefined, ...soundChannels]
        }, this.sound, { server: this.server, client: this }));

    if (soundName && typeof soundName != 'string')
        this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `soundName in  <${this.constructor.name}>.stopSound({ soundName: ${require('util').inspect(soundName)} })  `, {
            got: soundName,
            expectationType: 'type',
            expectation: "undefined | string"
        }, this.sound, { server: this.server, client: this }));

    this.p.sendPacket('stop_sound', {
        flags: channel ? (soundName ? 3 : 1) : (soundName ? 2 : 1),
        source: channel ? soundChannels.indexOf(channel) : undefined,
        sound: soundName ?? undefined
    })
}