module.exports = {
    darkSky: {
        get: function () {
            return this[this.ps._darkSky]
        },
        set: function (darkSky) {
            if (!this[this.ps.canUsed])
                throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

            if (darkSky != false && darkSky != true)
                throw new Error(`Unknown darkSky, expected true or false, received "${darkSky}" (${typeof darkSky})`)

            this[this.ps.sendPacket]('game_state_change', {
                reason: darkSky ? 2 : 1
            })

            this[this.ps._darkSky] = darkSky;
            this[this.ps.emitObservable]('darkSky');
        }
    }
}