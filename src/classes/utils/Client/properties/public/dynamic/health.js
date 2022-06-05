module.exports = {
    health: {
        get: function () {
            return this.p._health
        },
        set: function (h) {
            if (!this.p.canUsed)
                throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

            const health = parseInt(h);

            if (isNaN(health) || health < 0 || health > 20)
                throw new Error(`Unknown health, expected an integer between 0 and 20, received "${h}" (${typeof h})`)

            this.p.sendPacket('update_health', {
                health,
                food: this.p._food,
                foodSaturation: this.p._foodSaturation
            })

            this.p._health = health;
            this.p.emitObservable('health');
        },
        init: function () {
            this.p._health = 20;
        }
    }
}