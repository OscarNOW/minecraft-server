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
        async set(newValue, beforeReady) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            // if there is no skinAccountUuid, we can simply not load in a skin for the Client
            if (newValue === null)
                return;

            if (typeof newValue !== 'string')
                throw new Error(`Expected skinAccountUuid to be a string or null, received ${newValue} (${typeof newValue})`);

            this.p._skinAccountUuid = newValue;

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