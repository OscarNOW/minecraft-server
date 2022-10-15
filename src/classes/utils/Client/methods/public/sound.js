const { sounds, soundChannels } = require('../../../../../functions/loader/data.js');

const CustomError = require('../../../CustomError.js');

module.exports = function ({ sound, channel, position: { x, y, z }, volume, pitch }) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    if (!sounds.find(a => a.name == sound))
        this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `sound in  <${this.constructor.name}>.sound({ sound: ${require('util').inspect(sound)} })  `, {
            got: sound,
            expectationType: 'type',
            expectation: 'soundName',
            externalLink: '{docs}/types/soundName.html'
        }, this.sound, { server: this.server, client: this }));
    if (!soundChannels.includes(channel))
        this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `channel in  <${this.constructor.name}>.sound({ channel: ${require('util').inspect(channel)} })  `, {
            got: channel,
            expectationType: 'value',
            expectation: soundChannels
        }, this.sound, { server: this.server, client: this }));
    if (typeof volume != 'number' || volume < 0 || volume > 1)
        this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `volume in  <${this.constructor.name}>.sound({ volume: ${require('util').inspect(volume)} })  `, {
            got: volume,
            expectationType: 'type',
            expectation: '0 <= number <= 1'
        }, this.sound, { server: this.server, client: this }));

    //Multiplying by 8 is needed, see https://wiki.vg/index.php?title=Protocol&oldid=16091#Sound_Effect
    this.p.sendPacket('sound_effect', {
        soundId: sounds.find(a => a.name == sound).id,
        soundCategory: soundChannels.indexOf(channel),
        x: Math.round(x * 8),
        y: Math.round(y * 8),
        z: Math.round(z * 8),
        volume,
        pitch
    })
}