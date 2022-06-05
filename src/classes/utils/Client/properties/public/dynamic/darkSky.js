module.exports = {
    darkSky: {
        get: function () {
            return this.p._darkSky
        },
        set: function (darkSky) {
            if (!this.p.canUsed)
                throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

            if (darkSky != false && darkSky != true)
                throw new Error(`Unknown darkSky, expected true or false, received "${darkSky}" (${typeof darkSky})`)

            this.p.sendPacket('game_state_change', {
                reason: darkSky ? 2 : 1
            })

            this.p._darkSky = darkSky;
            this.p.emitObservable('darkSky');
        },
        init: function () {
            this.p._darkSky = false;
        }
    }
}