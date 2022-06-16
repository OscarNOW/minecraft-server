module.exports = {
    difficulty: {
        get: function () {
            return this.p._difficulty
        },
        set: function (difficulty) {
            if (!this.p.canUsed)
                if (this.online)
                    throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
                else
                    throw new Error(`Can't perform this action on an offline player`)

            if (!['peaceful', 'easy', 'normal', 'hard'].includes(difficulty))
                throw new Error(`Unknown difficulty "${difficulty}" (${typeof difficulty})`)

            this.p.sendPacket('difficulty', {
                difficulty: ['peaceful', 'easy', 'normal', 'hard'].findIndex(x => x == difficulty),
                difficultyLocked: true
            })

            this.p._difficulty = difficulty;
            this.p.emitObservable('difficulty');
        },
        init: function () {
            this.p._difficulty = 'normal';
        }
    }
}