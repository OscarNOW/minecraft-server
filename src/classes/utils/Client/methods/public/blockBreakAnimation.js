const { CustomError } = require('../../../CustomError.js');

module.exports = {
    blockBreakAnimation: function (location, stage) {
        if (!this.p.canUsed)
            if (this.online)
                throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
            else
                throw new Error(`Can't perform this action on an offline player`)

        if (stage < 0 || stage > 10)
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'stage', ''],
                ['in the function ', 'blockBreakAnimation', ''],
                ['in the class ', this.constructor.name, '']
            ], {
                got: stage,
                expectationType: 'value',
                expectation: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            }).toString()

        this.p.sendPacket('block_break_animation', {
            entityId: Math.floor(Math.random() * 1000),
            location,
            destroyStage: stage == 0 ? 10 : stage - 1
        })
    }
}