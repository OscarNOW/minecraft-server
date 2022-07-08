const { v4: uuid } = require('uuid');

const { Changable } = require('../../../Changable.js');

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
    bossBar: function ({ title, health, color, divisionAmount }) {
        let bossBarUuid = uuid();
        let active = true;

        let values = {
            title: `${title}`,
            health,
            color,
            divisionAmount: `${divisionAmount}`
        }

        let staticValues = {
            id: bossBarUuid,
            remove: () => {
                active = false;
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
            title: JSON.stringify({
                text: values.title
            }),
            health: values.health,
            color: colors[values.color],
            dividers: divisionIds[values.divisionAmount],
            flags: 0
        })

        let bossBar = new Changable(i => {
            if (!active) return;

            let healthChanged = i.health != values.health;
            let titleChanged = i.title != values.title;
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
                values.title = `${i.title}`;
                this.p.sendPacket('boss_bar', {
                    entityUUID: bossBarUuid,
                    action: 3,
                    title: JSON.stringify({
                        text: values.title
                    })
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