const fs = require('fs');
const path = require('path');

const { defaults } = require('../../../../../settings.json');
const { dimensionCodec } = require('../../../../../functions/loader/data.js');

module.exports = {
    sendLoginPacket() {
        const loginPacket = Object.freeze({
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
        });

        let customLoginProperties = {};
        let callAfterLogin = []; //todo: split into different state in stateHandler

        //get overwritten login properties
        this.p.defaultProperties = this.p.defaultClientProperties(this);
        for (const [name, value] of Object.entries(this.p.defaultProperties)) {
            let file = this.p.pubDynProperties[name];

            if (file.info?.callAfterLogin)
                callAfterLogin.push(() => file.setRaw.call(this, value, true))
            else if (file.info?.loginPacket) //todo: what does this property mean? (and what's the difference with info.callAfterLogin)
                customLoginProperties[name] = value;
        };

        //set login properties that were not given
        for (const file of fs
            .readdirSync(path.resolve(__dirname, '../../properties/public/dynamic/'))
            .filter(a => a.endsWith('.js'))
            .map(a => require(`../../properties/public/dynamic/${a}`))
            .map(a => Object.values(a))
            .flat()
            .filter(a => a.info?.loginPacket)
        )
            for (const { name } of file.info.loginPacket)
                if (customLoginProperties[name] === undefined)
                    customLoginProperties[name] = defaults[name];

        //convert properties to packet format
        let loginPacketProperties = {};
        for (const [name, value] of Object.entries(customLoginProperties)) {
            let file = this.p.pubDynProperties[name];

            for (const { minecraftName } of file.info.loginPacket)
                loginPacketProperties[minecraftName] = file.setRaw.call(this, value, true)[minecraftName];
        }

        this.p.sendPacket('login', { ...loginPacket, ...loginPacketProperties });

        for (const a of callAfterLogin) a(); //todo: move to different state in stateHandler
    }
}