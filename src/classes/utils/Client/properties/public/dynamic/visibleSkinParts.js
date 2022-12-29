module.exports = {
    visibleSkinParts: {
        info: {
            preventSet: true
        },
        get() {
            return this.p._visibleSkinParts;
        },
        set(value) {
            this.p._visibleSkinParts = value;
        },
        init() {
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