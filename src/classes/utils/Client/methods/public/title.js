const { Text } = require('../../../../exports/Text');

module.exports = {
    title: function (p) {
        if (!this.p.canUsed)
            if (this.online)
                throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
            else
                throw new Error(`Can't perform this action on an offline player`)

        let properties;
        if (p === undefined)
            properties = {};
        else if (typeof p == 'string' || p instanceof Text)
            properties = { title: p };
        else
                /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'libraryUser', [
                    ['', 'properties', ''],
                    ['in the function "', 'title', '"'],
                    ['in the class ', this.constructor.name, ''],
                ], {
                    got: p,
                    expectationType: 'type',
                    expectation: `string | Text | {
                        fadeIn?: number;
                        stay?: number;
                        fadeOut?: number;
                        title?: string | Text;
                        subTitle?: string | Text;
                    }`
                }, this.title).toString()

        let { fadeIn, stay, fadeOut, title, subTitle } = properties;

        this.p.sendPacket('title', {
            action: 5
        })

        this.p.sendPacket('title', {
            action: 3,
            fadeIn: fadeIn ?? 10,
            stay: stay ?? 40,
            fadeOut: fadeOut ?? 10
        })

        this.p.sendPacket('title', {
            action: 0,
            text: JSON.stringify({ translate: `${(title && title !== '') ? title : ''}` })
        })
        if (subTitle && subTitle !== '')
            this.p.sendPacket('title', {
                action: 1,
                text: JSON.stringify({ translate: `${subTitle}` })
            })
    }
}