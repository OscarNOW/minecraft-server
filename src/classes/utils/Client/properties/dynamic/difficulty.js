module.exports = {
    difficulty: {
        get: function () {
            return this[this.ps._difficulty]
        },
        set: function (difficulty) {
            if (!this[this.ps.canUsed])
                throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

            if (!['peaceful', 'easy', 'normal', 'hard'].includes(difficulty))
                throw new Error(`Unknown difficulty "${difficulty}" (${typeof difficulty})`)

            this[this.ps.sendPacket]('difficulty', {
                difficulty: ['peaceful', 'easy', 'normal', 'hard'].findIndex(x => x == difficulty),
                difficultyLocked: true
            })

            this[this.ps._difficulty] = difficulty;
            this[this.ps.emitObservable]('difficulty');
        },
        init: function () {
            this[this.ps._difficulty] = 'normal';
        }
    }
}