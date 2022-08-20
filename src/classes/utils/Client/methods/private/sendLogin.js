const fs = require('fs');
const path = require('path');

const CustomError = require('../../../CustomError.js');

const { defaults } = require('../../../../../settings.json');
const { dimensionCodec } = require('../../../../../functions/loader/data.js');

module.exports = {
    sendLogin: function () {
        let callAfterLogin = [];

        this.p.defaultProperties = this.p.defaultClientProperties(this);

        let loginPacket = {
            entityId: this.p.client.id,
            isHardcore: false,
            previousGameMode: 255,
            worldNames: ['minecraft:overworld', 'minecraft:the_nether', 'minecraft:the_end'],
            dimensionCodec,
            dimension: {
                type: 'compound',
                name: '',
                value: {
                    bed_works: { type: 'byte', value: 1 },
                    has_ceiling: { type: 'byte', value: 0 },
                    coordinate_scale: { type: 'double', value: 1 },
                    piglin_safe: { type: 'byte', value: 0 },
                    has_skylight: { type: 'byte', value: 1 },
                    ultrawarm: { type: 'byte', value: 0 },
                    infiniburn: { type: 'string', value: 'minecraft:infiniburn_overworld' },
                    effects: { type: 'string', value: 'minecraft:overworld' },
                    has_raids: { type: 'byte', value: 1 },
                    ambient_light: { type: 'float', value: 0 },
                    logical_height: { type: 'int', value: 256 },
                    natural: { type: 'byte', value: 1 },
                    respawn_anchor_works: { type: 'byte', value: 0 }
                }
            },
            worldName: 'minecraft:overworld',
            hashedSeed: [0, 0],
            maxPlayers: 0,
            viewDistance: 1000,
            isDebug: false,
            isFlat: false
        };

        for (const [key, value] of Object.entries(this.p.defaultProperties)) {
            if (!this.p.pubDynProperties[key])
                throw new CustomError('expectationNotMet', 'libraryUser', [
                    ['', 'default key', ''],
                    ['in the class ', this.constructor.name, '']
                ], {
                    got: key,
                    expectationType: 'value',
                    expectation: ['slot', 'position', 'clearSky', 'showRespawnScreen', 'gamemode', 'health', 'food', 'foodSaturation', 'difficulty']
                }, this.constructor).toString()

            let file = this.p.pubDynProperties[key];

            if (!file.setRaw)
                throw new CustomError('expectationNotMet', 'libraryUser', [
                    ['', 'default key', ''],
                    ['in the class ', this.constructor.name, '']
                ], {
                    got: key,
                    expectationType: 'value',
                    expectation: ['slot', 'position', 'clearSky', 'showRespawnScreen', 'gamemode', 'health', 'food', 'foodSaturation', 'difficulty']
                }, this.constructor).toString()

            let ret;
            if (file.info?.callAfterLogin)
                callAfterLogin.push(() => file.setRaw.call(this, value, true))
            else
                ret = file.setRaw.call(this, value, true);

            if (file.info?.loginPacket && ret)
                for (const [key, value] of Object.entries(ret))
                    loginPacket[key] = value;
        }

        fs
            .readdirSync(path.resolve(__dirname, '../../properties/public/dynamic/'))
            .filter(a => a.endsWith('.js'))
            .map(a => require(`../../properties/public/dynamic/${a}`))
            .map(a => Object.values(a))
            .flat()
            .filter(a => a.info?.loginPacket)
            .forEach(file => {
                for (const key of file.info.loginPacket)
                    if (loginPacket[key] === undefined)
                        loginPacket[key] = defaults[key];
            })

        this.p.sendPacket('login', loginPacket);

        for (const a of callAfterLogin) a();
    }
}