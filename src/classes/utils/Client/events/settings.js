const languages = require('../../../../data/static/languages.json');

module.exports = {
    settings: function ({ locale, viewDistance, chatFlags, chatColors, skinParts, mainHand }) {
        let langCode = locale.toLowerCase();
        if (!languages[langCode]) throw new Error(`Unknown language code "${langCode}" (${typeof langCode})`)

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
            throw new Error(`Unknown chatFlags "${chatFlags}" (${typeof chatFlags})`)

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
            throw new Error(`Unknown mainHand "${mainHand}" (${typeof mainHand})`)

        this.p.readyStates.clientSettings = true;
        this.p.updateCanUsed();
    }
}