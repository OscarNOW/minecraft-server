const { Text } = require('../../exports/Text');

module.exports = {
    title: function (p) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        let properties;
        if (p === undefined)
            properties = {};
        else if (typeof p == 'string' || p instanceof Text)
            properties = { title: p };
        else
            throw new Error(`Unknown p "${p}" (${typeof p})`)

        let { fadeIn, stay, fadeOut, title, subTitle } = properties;

        this[this.ps.sendPacket]('title', {
            action: 5
        })

        this[this.ps.sendPacket]('title', {
            action: 3,
            fadeIn: fadeIn ?? 10,
            stay: stay ?? 40,
            fadeOut: fadeOut ?? 10
        })

        this[this.ps.sendPacket]('title', {
            action: 0,
            text: JSON.stringify({ translate: `${(title && title !== '') ? title : ''}` })
        })
        if (subTitle && subTitle !== '')
            this[this.ps.sendPacket]('title', {
                action: 1,
                text: JSON.stringify({ translate: `${subTitle}` })
            })
    }
}