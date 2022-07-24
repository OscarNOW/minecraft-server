const { defaults } = require('../../../../../settings.json')

const { uuid } = require('../../../../../functions/uuid.js');
const { Changable } = require('../../../Changable.js');
const { Text } = require('../../../../exports/Text.js');

const colors = {
    pink: 0,
    blue: 1,
    red: 2,
    green: 3,
    yellow: 4,
    purple: 5,
    white: 6
}

const divisionIds = {
    '0': 0,
    '6': 1,
    '10': 2,
    '12': 3,
    '20': 4
}

module.exports = {
    bossBar: function ({ title = defaults.bossBar.title, health = defaults.bossBar.health, color = defaults.bossBar.color, divisionAmount = defaults.bossBar.divisionAmount, flags: { darkenSky = defaults.bossBar.flags.darkenSky, playEndMusic = defaults.bossBar.flags.playEndMusic, createFog = defaults.bossBar.flags.createFog } = defaults.bossBar.flags } = defaults.bossBar) {
        if (!this.p.canUsed)
            if (this.online)
                throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
            else
                throw new Error(`Can't perform this action on an offline player`)

        let bossBarUuid = uuid();
        let bossBarVisible = true;

        let flags = {
            darkenSky,
            playEndMusic,
            createFog
        }

        let onFlagsChanged = newFlags => {
            if (!bossBarVisible) return;

            if (!this.p.canUsed)
                if (this.online)
                    throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
                else
                    throw new Error(`Can't perform this action on an offline player`)

            let darkenSkyChanged = flags.darkenSky != newFlags.darkenSky;
            let playEndMusicChanged = flags.playEndMusic != newFlags.playEndMusic;
            let createFogChanged = flags.createFog != newFlags.createFog;

            if (darkenSkyChanged || playEndMusicChanged || createFogChanged) {
                flags.darkenSky = newFlags.darkenSky;
                flags.playEndMusic = newFlags.playEndMusic;
                flags.createFog = newFlags.createFog;

                this.p.sendPacket('boss_bar', {
                    entityUUID: bossBarUuid,
                    action: 5,
                    flags: parseInt([flags.createFog, flags.playEndMusic, flags.darkenSky].map(a => a ? '1' : '0').join(''), 2)
                })
            }
        };

        let flagsChangable = new Changable(onFlagsChanged, flags);

        if (!(title instanceof Text))
            title = new Text(title);

        let values = {
            title,
            health,
            color,
            divisionAmount: `${divisionAmount}`,
            flags: flagsChangable
        }

        let staticValues = {
            id: bossBarUuid,
            remove: () => {
                bossBarVisible = false;
                this.bossBars = this.bossBars.filter(a => a.id != bossBarUuid);

                this.p.sendPacket('boss_bar', {
                    entityUUID: bossBarUuid,
                    action: 1
                })
            }
        }

        this.p.sendPacket('boss_bar', {
            entityUUID: bossBarUuid,
            action: 0,
            title: JSON.stringify(values.title.chat),
            health: values.health,
            color: colors[values.color],
            dividers: divisionIds[values.divisionAmount],
            flags: parseInt([flags.createFog, flags.playEndMusic, flags.darkenSky].map(a => a ? '1' : '0').join(''), 2)
        })

        let bossBar = new Changable(i => {
            if (i.flags != flagsChangable) {
                flagsChangable = new Changable(onFlagsChanged, i.flags);
                bossBar.setRaw('flags', flagsChangable);
                onFlagsChanged(i.flags);
            }

            if (!(i.title instanceof Text))
                i.title = new Text(i.title);

            if (!bossBarVisible) return;

            if (!this.p.canUsed)
                if (this.online)
                    throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
                else
                    throw new Error(`Can't perform this action on an offline player`)

            let healthChanged = i.health != values.health;
            let titleChanged = i.title.hash != values.title.hash;
            let colorChanged = i.color != values.color;
            let divisionAmountChanged = i.divisionAmount != values.divisionAmount;

            if (healthChanged) {
                values.health = i.health;
                this.p.sendPacket('boss_bar', {
                    entityUUID: bossBarUuid,
                    action: 2,
                    health: values.health
                })
            }

            if (titleChanged) {
                let newTitle = i.title;
                if (!(newTitle instanceof Text))
                    newTitle = new Text(newTitle);

                values.title = newTitle;
                this.p.sendPacket('boss_bar', {
                    entityUUID: bossBarUuid,
                    action: 3,
                    title: JSON.stringify(values.title.chat)
                })
            }

            if (colorChanged || divisionAmountChanged) {
                values.color = i.color;
                values.divisionAmount = `${i.divisionAmount}`;

                this.p.sendPacket('boss_bar', {
                    entityUUID: bossBarUuid,
                    action: 4,
                    color: colors[values.color],
                    dividers: divisionIds[values.divisionAmount],
                })
            }
        }, {
            ...values,
            ...staticValues
        })

        this.bossBars.push(bossBar);

        return bossBar;

    }
}