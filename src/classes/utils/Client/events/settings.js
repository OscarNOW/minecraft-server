const { languages } = require('../../../../functions/loader/data.js');

const settingsSent = new WeakSet();

const CustomError = require('../../CustomError.js');

module.exports = {
    settings: function ({ locale, viewDistance, chatFlags, chatColors, skinParts, mainHand }) {
        let langCode = locale.toLowerCase();
        if (!languages[langCode])
            this.p.emitError(new CustomError('expectationNotMet', 'client', `locale in  <remote ${this.constructor.name}>.settings({ locale: ${require('util').inspect(langCode)} })  `, {
                got: langCode,
                expectationType: 'value',
                expectation: Object.keys(languages)
            }))

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
            this.p.emitError(new CustomError('expectationNotMet', 'client', `chatFlags in  <remote ${this.constructor.name}>.settings({ chatFlags: ${require('util').inspect(chatFlags)} })  `, {
                got: chatFlags,
                expectationType: 'value',
                expectation: [0, 1, 2]
            }))

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
            this.p.emitError(new CustomError('expectationNotMet', 'client', `mainHand in  <remote ${this.constructor.name}>.settings({ mainHand: ${require('util').inspect(mainHand)} })  `, {
                got: mainHand,
                expectationType: 'value',
                expectation: [0, 1]
            }))

        if (!settingsSent.has(this)) {
            settingsSent.add(this)
            this.p.stateHandler.updateState.packetReceived.call(this, 'settings')
        }
    }
}