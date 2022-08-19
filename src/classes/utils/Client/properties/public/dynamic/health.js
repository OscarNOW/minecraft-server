const CustomError = require('../../../../CustomError.js');

module.exports = {
    health: {
        info: {
            callAfterLogin: true
        },
        get: function () {
            return this.p._health
        },
        set: function (v) {
            this.p.stateHandler.checkReady.call(this);

            const value = parseInt(v);

            if (isNaN(value) || value < 0 || value > 20)
                throw new CustomError('expectationNotMet', 'libraryUser', [
                    ['', 'health', ''],
                    ['in the function "', 'set health', '"'],
                    ['in the class ', this.constructor.name, ''],
                ], {
                    got: v,
                    expectationType: 'value',
                    expectation: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
                }).toString()

            this.p.sendPacket('update_health', {
                health: value,
                food: this.p._food,
                foodSaturation: this.p._foodSaturation
            })

            this.p._health = value;
            this.p.emitObservable('health');
        },
        setRaw: function (v) {
            const value = parseInt(v);

            if (isNaN(value) || value < 0 || value > 20)
                throw new CustomError('expectationNotMet', 'libraryUser', [
                    ['', 'health', ''],
                    ['in the function "', 'setRaw health', '"'],
                    ['in the class ', this.constructor.name, ''],
                ], {
                    got: v,
                    expectationType: 'value',
                    expectation: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
                }).toString()

            this.p.sendPacket('update_health', {
                health: value,
                food: this.p._food,
                foodSaturation: this.p._foodSaturation
            })

            this.p._health = value;
        },
        init: function () {
            this.p._health = 20;
        }
    }
}