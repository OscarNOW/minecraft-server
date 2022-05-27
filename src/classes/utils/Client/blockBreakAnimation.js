module.exports = {
    blockBreakAnimation: function (location, stage) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        if (stage < 0 || stage > 10)
            throw new Error(`Unknown stage "${stage}" (${typeof stage})`)

        this[this.ps.sendPacket]('block_break_animation', {
            entityId: Math.floor(Math.random() * 1000),
            location,
            destroyStage: stage == 0 ? 10 : stage - 1
        })
    }
}