const { CustomError } = require('../../../../CustomError.js');

module.exports = {
    foodSaturation: {
        info: {
            callAfterLogin: true
        },
        get: function () {
            return this.p._foodSaturation
        },
        set: function (v) {
            if (!this.p.canUsed)
                if (this.online)
                    throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
                else
                    throw new Error(`Can't perform this action on an offline player`)

            const value = parseInt(v);

            if (isNaN(value) || value < 0 || value > 5)
                throw new CustomError('expectationNotMet', 'libraryUser', [
                    ['', 'foodSaturation', ''],
                    ['in the function "', 'set foodSaturation', '"'],
                    ['in the class ', this.constructor.name, ''],
                ], {
                    got: v,
                    expectationType: 'value',
                    expectation: [0, 1, 2, 3, 4, 5]
                }).toString()

            this.p.sendPacket('update_health', {
                health: this.p._health,
                food: this.p._food,
                foodSaturation: value
            })

            this.p._foodSaturation = value;
            this.p.emitObservable('foodSaturation');
        },
        setRaw(v) {
            const value = parseInt(v);

            if (isNaN(value) || value < 0 || value > 5)
                throw new CustomError('expectationNotMet', 'libraryUser', [
                    ['', 'foodSaturation', ''],
                    ['in the function "', 'setRaw foodSaturation', '"'],
                    ['in the class ', this.constructor.name, ''],
                ], {
                    got: v,
                    expectationType: 'value',
                    expectation: [0, 1, 2, 3, 4, 5]
                }).toString()

            this.p.sendPacket('update_health', {
                health: this.p._health,
                food: this.p._food,
                foodSaturation: value
            })

            this.p._foodSaturation = value;
        },
        init: function () {
            this.p._foodSaturation = 5;
        }
    }
}