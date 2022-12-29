module.exports = {
    visibleSkinParts: {
        info: {
            preventSet: true
        },
        get: function () {
            if (!this.p._visibleSkinParts)
                this.p._visibleSkinParts = Object.freeze({
                    cape: null,
                    torso: null,
                    leftArm: null,
                    rightArm: null,
                    leftLeg: null,
                    rightLeg: null,
                    hat: null
                });

            return this.p._visibleSkinParts;
        },
        set: function (value) {
            this.p._visibleSkinParts = value;
        }
    }
}