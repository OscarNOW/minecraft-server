module.exports = {
    food: {
        info: {
            callAfterLogin: true
        },
        get: function () {
            return this.p._food
        },
        set: function (v) {
            if (!this.p.canUsed)
                if (this.online)
                    throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
                else
                    throw new Error(`Can't perform this action on an offline player`)

            const value = parseInt(v);

            if (isNaN(value) || value < 0 || value > 20)
                throw new Error(`Unknown food, expected an integer between 0 and 20, received "${v}" (${typeof v})`)

            this.p.sendPacket('update_health', {
                health: this.health,
                food: value,
                foodSaturation: this.foodSaturation
            })

            this.p._food = value;
            this.p.emitObservable('food');
        },
        setRaw: function (v) {
            const value = parseInt(v);

            if (isNaN(value) || value < 0 || value > 20)
                throw new Error(`Unknown food, expected an integer between 0 and 20, received "${v}" (${typeof v})`)

            this.p.sendPacket('update_health', {
                health: this.health,
                food: value,
                foodSaturation: this.foodSaturation
            })

            this.p._food = value;
        },
        init: function () {
            this.p._food = 20;
        }
    }
}