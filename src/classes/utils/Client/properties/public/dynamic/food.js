module.exports = {
    food: {
        get: function () {
            return this.p._food
        },
        set: function (f) {
            if (!this.p.canUsed)
                if (this.online)
                    throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
                else
                    throw new Error(`Can't perform this action on an offline player`)

            const food = parseInt(f);

            if (isNaN(food) || food < 0 || food > 20)
                throw new Error(`Unknown food, expected an integer between 0 and 20, received "${f}" (${typeof f})`)

            this.p.sendPacket('update_health', {
                health: this.p._health,
                food,
                foodSaturation: this.p._foodSaturation
            })

            this.p._food = food;
            this.p.emitObservable('food');
        },
        init: function () {
            this.p._food = 20;
        }
    }
}