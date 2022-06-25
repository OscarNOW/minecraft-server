module.exports = {
    difficulty: {
        info: {
            callAfterLogin: true
        },
        get: function () {
            return this.p._difficulty
        },
        set: function (value) {
            if (!this.p.canUsed)
                if (this.online)
                    throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
                else
                    throw new Error(`Can't perform this action on an offline player`)

            if (!['peaceful', 'easy', 'normal', 'hard'].includes(value))
                throw new Error(`Unknown difficulty "${value}" (${typeof value})`)

            this.p.sendPacket('difficulty', {
                difficulty: ['peaceful', 'easy', 'normal', 'hard'].findIndex(x => x == value),
                difficultyLocked: true
            })

            this.p._difficulty = value;
            this.p.emitObservable('difficulty');
        },
        setRaw: function (value) {
            if (!['peaceful', 'easy', 'normal', 'hard'].includes(value))
                throw new Error(`Unknown difficulty "${value}" (${typeof value})`)

            this.p.sendPacket('difficulty', {
                difficulty: ['peaceful', 'easy', 'normal', 'hard'].findIndex(x => x == value),
                difficultyLocked: true
            })

            this.p._difficulty = value;
        },
        init: function () {
            this.p._difficulty = 'normal';
        }
    }
}