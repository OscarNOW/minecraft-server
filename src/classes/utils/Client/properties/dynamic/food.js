module.exports = {
    food: {
        get: function () {
            return this[this.ps._food]
        },
        set: function (f) {
            if (!this[this.ps.canUsed])
                throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

            const food = parseInt(f);

            if (isNaN(food) || food < 0 || food > 20)
                throw new Error(`Unknown food, expected an integer between 0 and 20, received "${f}" (${typeof f})`)

            this[this.ps.sendPacket]('update_health', {
                health: this[this.ps._health],
                food,
                foodSaturation: this[this.ps._foodSaturation]
            })

            this[this.ps._food] = food;
            this[this.ps.emitObservable]('food');
        },
        init: function () {
            this[this.ps._food] = 20;
        }
    }
}