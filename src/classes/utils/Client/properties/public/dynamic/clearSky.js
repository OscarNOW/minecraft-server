module.exports = {
    clearSky: {
        info: {
            callAfterLogin: true
        },
        get: function () {
            return this.p._clearSky
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
                        ['', 'clearSky', ''],
                        ['in the function "', 'set clearSky', '"'],
                        ['in the class ', this.constructor.name, ''],
                    ], {
                        got: value,
                        expectationType: 'type',
                        expectation: 'boolean'
                    }).toString()

            this.p.sendPacket('game_state_change', {
                reason: value ? 1 : 2
            })

            this.p._clearSky = value;
            this.p.emitObservable('clearSky');
        },
        setRaw: function (value) {
            if (typeof value != 'boolean')
                    /* -- Look at stack trace for location -- */ throw new
                    CustomError('expectationNotMet', 'libraryUser', [
                        ['', 'clearSky', ''],
                        ['in the function "', 'setRaw clearSky', '"'],
                        ['in the class ', this.constructor.name, ''],
                    ], {
                        got: value,
                        expectationType: 'type',
                        expectation: 'boolean'
                    }).toString()

            this.p.sendPacket('game_state_change', {
                reason: value ? 1 : 2
            })

            this.p._clearSky = value;
        },
        init: function () {
            this.p._clearSky = true;
        }
    }
}