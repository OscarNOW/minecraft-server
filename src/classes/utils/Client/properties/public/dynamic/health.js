module.exports = {
    health: {
        info: {
            callAfterLogin: true
        },
        get: function () {
            return this.p._health
        },
        set: function (v) {
            if (!this.p.canUsed)
                if (this.online)
                    throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
                else
                    throw new Error(`Can't perform this action on an offline player`)

            const value = parseInt(v);

            if (isNaN(value) || value < 0 || value > 20)
                throw new Error(`Unknown health, expected an integer between 0 and 20, received "${v}" (${typeof v})`)

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
                throw new Error(`Unknown health, expected an integer between 0 and 20, received "${v}" (${typeof v})`)

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