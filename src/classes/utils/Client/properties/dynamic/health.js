module.exports = {
    health: {
        get: function () {
            return this[this.ps._health]
        },
        set: function (h) {
            if (!this[this.ps.canUsed])
                throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

            const health = parseInt(h);

            if (isNaN(health) || health < 0 || health > 20)
                throw new Error(`Unknown health, expected an integer between 0 and 20, received "${h}" (${typeof h})`)

            this[this.ps.sendPacket]('update_health', {
                health,
                food: this[this.ps._food],
                foodSaturation: this[this.ps._foodSaturation]
            })

            this[this.ps._health] = health;
            this[this.ps.emitObservable]('health');
        },
        init: function () {
            this[this.ps._health] = 20;
        }
    }
}