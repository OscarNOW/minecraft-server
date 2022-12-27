const CustomError = require('../../../../CustomError.js');

const { difficulties } = require('../../../../../../functions/loader/data.js');

module.exports = {
    difficulty: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get: function () {
            return this.p._difficulty
        },
        set: function (newValue) {
            if (!this.p.stateHandler.checkReady.call(this))
                return;

            if (!difficulties.includes(newValue))
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `difficulty in  <${this.constructor.name}>.difficulty = ${require('util').inspect(newValue)}  `, {
                    got: newValue,
                    expectationType: 'value',
                    expectation: difficulties
                }, null, { server: this.server, client: this }));

            const oldValue = this.difficulty;
            this.p._difficulty = newValue;

            this.p.sendPacket('difficulty', {
                difficulty: difficulties.findIndex(x => x === newValue),
                difficultyLocked: true
            });

            if (oldValue !== newValue)
                this.p.emitChange('difficulty', oldValue);
        },
        setRaw: function (value) {
            if (!difficulties.includes(value))
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `difficulty in  <${this.constructor.name}>.difficulty = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'value',
                    expectation: difficulties
                }, null, { server: this.server, client: this }));

            this.p.sendPacket('difficulty', {
                difficulty: difficulties.findIndex(x => x === value),
                difficultyLocked: true
            })

            this.p._difficulty = value;
        },
        init: function () {
            this.p._difficulty = 'normal';
        }
    }
}