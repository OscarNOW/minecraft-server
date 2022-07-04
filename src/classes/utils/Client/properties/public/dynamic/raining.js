const { CustomError } = require('../../../../CustomError.js');

module.exports = {
    raining: {
        info: {
            callAfterLogin: true
        },
        get: function () {
            return this.p._raining
        },
        set: function (value) {
            if (!this.p.canUsed)
                if (this.online)
                    throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
                else
                    throw new Error(`Can't perform this action on an offline player`)

            if (typeof value != 'boolean')
                    /* -- Look at stack trace for location -- */ throw new
                    CustomError('expectationNotMet', 'libraryUser', [
                        ['', 'raining', ''],
                        ['in the function "', 'set raining', '"'],
                        ['in the class ', this.constructor.name, ''],
                    ], {
                        got: value,
                        expectationType: 'type',
                        expectation: 'boolean'
                    }).toString()

            this.p.sendPacket('game_state_change', {
                reason: 7,
                gameMode: value ? this.toxicRainLevel + 1 : 0
            })

            this.p._raining = value;
            this.p.emitObservable('raining');
        },
        setRaw: function (value) {
            if (typeof value != 'boolean')
                    /* -- Look at stack trace for location -- */ throw new
                    CustomError('expectationNotMet', 'libraryUser', [
                        ['', 'raining', ''],
                        ['in the function "', 'setRaw raining', '"'],
                        ['in the class ', this.constructor.name, ''],
                    ], {
                        got: value,
                        expectationType: 'type',
                        expectation: 'boolean'
                    }).toString()

            this.p.sendPacket('game_state_change', {
                reason: 7,
                gameMode: value ? this.toxicRainLevel + 1 : 0
            })

            this.p._raining = value;
        },
        init: function () {
            this.p._raining = false;
        }
    }
}