module.exports = {
    arm_animation: function ({ hand }) {
        //todo: add check to check if hand is 1 or 0, and emit misbehavior CustomError if not
        const isMainHand = hand === 0;

        this.p.emit('armSwing', isMainHand);
    }
}