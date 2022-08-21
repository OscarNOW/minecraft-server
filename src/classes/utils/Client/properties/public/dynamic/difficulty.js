const CustomError = require('../../../../CustomError.js');

module.exports = {
    difficulty: {
        info: {
            callAfterLogin: true
        },
        get: function () {
            return this.p._difficulty
        },
        set: function (value) {
            this.p.stateHandler.checkReady.call(this);

            if (!['peaceful', 'easy', 'normal', 'hard'].includes(value))
                throw new CustomError('expectationNotMet', 'libraryUser', `difficulty in  <${this.constructor.name}>.difficulty = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'value',
                    expectation: ['peaceful', 'easy', 'normal', 'hard']
                }).toString()

            this.p.sendPacket('difficulty', {
                difficulty: ['peaceful', 'easy', 'normal', 'hard'].findIndex(x => x == value),
                difficultyLocked: true
            })

            this.p._difficulty = value;
            this.p.emitObservable('difficulty');
        },
        setRaw: function (value) {
            if (!['peaceful', 'easy', 'normal', 'hard'].includes(value))
                throw new CustomError('expectationNotMet', 'libraryUser', `difficulty in  <${this.constructor.name}>.difficulty = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'value',
                    expectation: ['peaceful', 'easy', 'normal', 'hard']
                }).toString()

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