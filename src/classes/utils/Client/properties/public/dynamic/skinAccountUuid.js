const CustomError = require('../../../../CustomError.js');
const { getSkinTextures } = require('../../../../../../functions/getSkinTextures');
const settings = require('../../../../../../settings.json');

module.exports = {
    skinAccountUuid: {
        info: {
            preventSet: true,
            defaultable: true,
            defaultSetTime: 'afterLogin',
            alwaysRequiresDefaultSet: true
        },
        get() {
            return this.p._skinAccountUuid;
        },
        async set(value, beforeReady) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            // if there is no skinAccountUuid, we can simply not load in a skin for the Client
            if (value === null)
                return;

            if (typeof value !== 'string')
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `skinAccountUuid in  <${this.constructor.name}>.skinAccountUuid = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'type',
                    expectation: 'string'
                }, null, { server: this.server, client: this }));

            this.p._skinAccountUuid = value;

            // we spawn a temporary tabItem with the same uuid as the Client, this will change the Client skin
            this.p.sendPacket('player_info', {
                action: 0,
                data: [{
                    UUID: this.uuid,
                    name: '',
                    displayName: JSON.stringify(''),
                    properties: (await getSkinTextures(this.skinAccountUuid)).properties,
                    gamemode: 0,
                    ping: -1
                }]
            });

            await new Promise(res => setTimeout(res, settings.timing.skinLoadTime));

            this.p.sendPacket('player_info', {
                action: 4,
                data: [{
                    UUID: this.uuid
                }]
            });
        },
        init() {
            this.p._skinAccountUuid = this.uuid;
        }
    }
}