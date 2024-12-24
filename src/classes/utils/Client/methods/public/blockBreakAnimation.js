module.exports = function (location, stage) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    if (typeof stage !== 'number' || isNaN(stage) || stage < 0 || stage > 10)
        throw new Error(`blockBreakAnimation stage must be a number between 0 and 10, received ${stage} (${typeof stage})`);

    this.p.sendPacket('block_break_animation', {
        entityId: Math.floor(Math.random() * 1000),
        location,
        destroyStage: stage === 0 ? 10 : stage - 1
    });
}
