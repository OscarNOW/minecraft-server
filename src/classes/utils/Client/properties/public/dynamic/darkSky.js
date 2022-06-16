module.exports = {
    clearSky: {
        get: function () {
            return this.p._clearSky
        },
        set: function (clearSky) {
            if (!this.p.canUsed)
                if (this.online)
                    throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
                else
                    throw new Error(`Can't perform this action on an offline player`)

            if (clearSky != false && clearSky != true)
                throw new Error(`Unknown clearSky, expected true or false, received "${clearSky}" (${typeof clearSky})`)

            this.p.sendPacket('game_state_change', {
                reason: clearSky ? 1 : 2
            })

            this.p._clearSky = clearSky;
            this.p.emitObservable('clearSky');
        },
        init: function () {
            this.p._clearSky = true;
        }
    }
}