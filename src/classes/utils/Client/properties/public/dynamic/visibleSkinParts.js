module.exports = {
    visibleSkinParts: {
        info: {
            preventSet: true
        },
        get: function () {
            return this.p._visibleSkinParts;
        },
        set: function (value) {
            this.p._visibleSkinParts = value;
        },
        init: function () {
            this.p._visibleSkinParts = Object.freeze({
                cape: null,
                torso: null,
                leftArm: null,
                rightArm: null,
                leftLeg: null,
                rightLeg: null,
                hat: null
            });
        }
    }
}