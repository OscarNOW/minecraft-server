const { CustomError } = require('../../../../CustomError.js');

module.exports = {
    toxicRainLevel: {
        info: {
            callAfterLogin: true
        },
        get: function () {
            return this.p._toxicRainLevel
        },
        set: function (value) {
            if (!this.p.canUsed)
                if (this.online)
                    throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
                else
                    throw new Error(`Can't perform this action on an offline player`)

            if (typeof value != 'number')
                    /* -- Look at stack trace for location -- */ throw new
                    CustomError('expectationNotMet', 'libraryUser', [
                        ['', 'toxicRainLevel', ''],
                        ['in the function "', 'set toxicRainLevel', '"'],
                        ['in the class ', this.constructor.name, ''],
                    ], {
                        got: value,
                        expectationType: 'type',
                        expectation: 'number'
                    }).toString()

            if (this.raining)
                this.p.sendPacket('game_state_change', {
                    reason: 7,
                    gameMode: value + 1
                })

            this.p._toxicRainLevel = value;
            this.p.emitObservable('toxicRainLevel');
        },
        setRaw: function (value) {
            if (typeof value != 'number')
                    /* -- Look at stack trace for location -- */ throw new
                    CustomError('expectationNotMet', 'libraryUser', [
                        ['', 'toxicRainLevel', ''],
                        ['in the function "', 'setRaw toxicRainLevel', '"'],
                        ['in the class ', this.constructor.name, ''],
                    ], {
                        got: value,
                        expectationType: 'type',
                        expectation: 'number'
                    }).toString()

            if (this.raining)
                this.p.sendPacket('game_state_change', {
                    reason: 7,
                    gameMode: value + 1
                })

            this.p._toxicRainLevel = value;
        },
        init: function () {
            this.p._toxicRainLevel = 0;
        }
    }
}