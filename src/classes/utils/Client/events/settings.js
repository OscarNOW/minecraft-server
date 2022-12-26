const { languages } = require('../../../../functions/loader/data.js');

const settingsSent = new WeakSet(); //todo: convert to private property

const CustomError = require('../../CustomError.js');

const clientLocale = require('../properties/public/dynamic/locale.js').locale;
const clientViewDistance = require('../properties/public/dynamic/viewDistance.js').viewDistance;
const clientChatSettings = require('../properties/public/dynamic/chatSettings.js').chatSettings;
const clientVisibleSkinParts = require('../properties/public/dynamic/visibleSkinParts.js').visibleSkinParts;
const clientRightHanded = require('../properties/public/dynamic/rightHanded.js').rightHanded;

module.exports = {
    settings: function ({ locale, viewDistance, chatFlags, chatColors, skinParts, mainHand }) {
        let langCode = locale.toLowerCase();
        if (!languages[langCode])
            this.p.emitError(new CustomError('expectationNotMet', 'client', `locale in  <remote ${this.constructor.name}>.settings({ locale: ${require('util').inspect(langCode)} })  `, {
                got: langCode,
                expectationType: 'value',
                expectation: Object.keys(languages)
            }, null, { server: this.server, client: this }));

        let obj = languages[langCode];
        obj.langCode = langCode;

        clientLocale.setPrivate.call(this, Object.freeze(obj));
        clientViewDistance.setPrivate.call(this, viewDistance);

        if (chatFlags === 0)
            clientChatSettings.setPrivate.call(this, Object.freeze({
                visible: 'all',
                colors: chatColors
            }));
        else if (chatFlags === 1)
            clientChatSettings.setPrivate.call(this, Object.freeze({
                visible: 'commands',
                colors: chatColors
            }));
        else if (chatFlags === 2)
            clientChatSettings.setPrivate.call(this, Object.freeze({
                visible: 'none',
                colors: chatColors
            }));
        else
            this.p.emitError(new CustomError('expectationNotMet', 'client', `chatFlags in  <remote ${this.constructor.name}>.settings({ chatFlags: ${require('util').inspect(chatFlags)} })  `, {
                got: chatFlags,
                expectationType: 'value',
                expectation: [0, 1, 2]
            }, null, { server: this.server, client: this }));

        let bsp = Number(skinParts).toString(2).padStart(7, '0').split('').map(bit => Number(bit) === 1);
        clientVisibleSkinParts.setPrivate.call(this, Object.freeze({
            cape: bsp[6],
            torso: bsp[5],
            leftArm: bsp[4],
            rightArm: bsp[3],
            leftLeg: bsp[2],
            rightLeg: bsp[1],
            hat: bsp[0]
        }));

        if (mainHand === 0)
            clientRightHanded.setPrivate.call(this, false);
        else if (mainHand === 1)
            clientRightHanded.setPrivate.call(this, true);
        else
            this.p.emitError(new CustomError('expectationNotMet', 'client', `mainHand in  <remote ${this.constructor.name}>.settings({ mainHand: ${require('util').inspect(mainHand)} })  `, {
                got: mainHand,
                expectationType: 'value',
                expectation: [0, 1]
            }, null, { server: this.server, client: this }));

        if (!settingsSent.has(this)) {
            settingsSent.add(this)
            this.p.stateHandler.updateState.packetReceived.call(this, 'settings')
        }
    }
}