const { languages } = require('../../../../functions/loader/data.js');

const { CustomError } = require('../../CustomError.js');

module.exports = {
    settings: function ({ locale, viewDistance, chatFlags, chatColors, skinParts, mainHand }) {
        let langCode = locale.toLowerCase();
        if (!languages[langCode])
                /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'client', [
                    ['', 'language code', ''],
                    ['in the event ', 'settings', '']
                    ['in the class ', this.constructor.name, '']
                ], {
                    got: langCode,
                    expectationType: 'value',
                    expectation: Object.keys(languages)
                }).toString()

        let obj = languages[langCode];
        obj.langCode = langCode;

        this.locale = obj;
        this.viewDistance = viewDistance;

        if (chatFlags === 0)
            this.chatSettings = Object.freeze({
                visible: 'all',
                colors: chatColors
            });
        else if (chatFlags === 1)
            this.chatSettings = Object.freeze({
                visible: 'commands',
                colors: chatColors
            });
        else if (chatFlags === 2)
            this.chatSettings = Object.freeze({
                visible: 'none',
                colors: chatColors
            });
        else
                /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'client', [
                    ['', 'chatFlags', ''],
                    ['in the event ', 'settings', '']
                    ['in the class ', this.constructor.name, '']
                ], {
                    got: chatFlags,
                    expectationType: 'value',
                    expectation: [0, 1, 2]
                }).toString()

        let bsp = Number(skinParts).toString(2).padStart(7, '0').split('').map(bit => Number(bit) === 1);
        this.visibleSkinParts = Object.freeze({
            cape: bsp[6],
            torso: bsp[5],
            leftArm: bsp[4],
            rightArm: bsp[3],
            leftLeg: bsp[2],
            rightLeg: bsp[1],
            hat: bsp[0]
        })

        if (mainHand === 0)
            this.rightHanded = false
        else if (mainHand === 1)
            this.rightHanded = true
        else
                /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'client', [
                    ['', 'mainHand', ''],
                    ['in the event ', 'settings', '']
                    ['in the class ', this.constructor.name, '']
                ], {
                    got: langCode,
                    expectationType: 'value',
                    expectation: [0, 1]
                }).toString()

        this.p.readyStates.clientSettings = true;
        this.p.updateCanUsed();
    }
}