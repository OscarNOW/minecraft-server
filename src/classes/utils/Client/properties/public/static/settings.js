module.exports = {
    locale: () => Object.freeze({
        langCode: null,
        englishName: null,
        menuName: null,
        version: null,
        region: null
    }),
    viewDistance: () => null,
    chatSettings: () => Object.freeze({
        visible: null,
        colors: null
    }),
    visibleSkinParts: () => Object.freeze({
        cape: null,
        torso: null,
        leftArm: null,
        rightArm: null,
        leftLeg: null,
        rightLeg: null,
        hat: null
    }),
    rightHanded: () => null
}