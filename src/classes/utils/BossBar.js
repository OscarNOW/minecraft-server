const { defaults } = require('../../settings.json');

const { uuid } = require('../../functions/uuid.js');
const Text = require('../exports/Text.js');

const _p = Symbol('private');

const colors = Object.freeze({
    pink: 0,
    blue: 1,
    red: 2,
    green: 3,
    yellow: 4,
    purple: 5,
    white: 6
})

const divisionIds = Object.freeze({
    '0': 0,
    '6': 1,
    '10': 2,
    '12': 3,
    '20': 4
})

class BossBar {
    constructor(client, sendPacket, { title = defaults.bossBar.title, health = defaults.bossBar.health, color = defaults.bossBar.color, divisionAmount = defaults.bossBar.divisionAmount, flags: { darkenSky = defaults.bossBar.flags.darkenSky, playEndMusic = defaults.bossBar.flags.playEndMusic, createFog = defaults.bossBar.flags.createFog } = defaults.bossBar.flags } = defaults.bossBar) {
        this.client = client;
        this.p.sendPacket = sendPacket;

        this.client.p.stateHandler.checkReady.call(this.client);

        const bossBarUuid = uuid();

        if (!(title instanceof Text))
            title = new Text(title)

        divisionAmount = `${divisionAmount}`;

        this.p.sendPacket('boss_bar', {
            entityUUID: bossBarUuid,
            action: 0,
            title: JSON.stringify(title.chat),
            health: health,
            color: colors[color],
            dividers: divisionIds[divisionAmount],
            flags: parseInt([createFog, playEndMusic, darkenSky].map(a => a ? '1' : '0').join(''), 2)
        })

        throw new Error('Not implemented')
    }

    get p() {
        let callPath = new Error().stack.split('\n')[2];

        if (callPath.includes('('))
            callPath = callPath.split('(')[1].split(')')[0];
        else
            callPath = callPath.split('at ')[1];

        callPath = callPath.split(':').slice(0, 2).join(':');

        let folderPath = path.resolve(__dirname, '../../');

        if (callPath.startsWith(folderPath)) {
            if (!this[_p])
                this[_p] = Object.assign({}, defaultPrivate);

            return this[_p];
        } else
            return this.p._p
    }

    set p(value) {
        this.p._p = value;
    }
}

module.exports = BossBar;