module.exports = {
    foodSaturation: {
        get: function () {
            return this.p._foodSaturation
        },
        set: function (fs) {
            if (!this.p.canUsed)
                throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

            const foodSaturation = parseInt(fs);

            if (isNaN(foodSaturation) || foodSaturation < 0 || foodSaturation > 5)
                throw new Error(`Unknown foodSaturation, expected an integer between 0 and 5, received "${fs}" (${typeof fs})`)

            this.p.sendPacket('update_health', {
                health: this.p._health,
                food: this.p._food,
                foodSaturation
            })

            this.p._foodSaturation = foodSaturation;
            this.p.emitObservable('foodSaturation');
        },
        init: function () {
            this.p._foodSaturation = 5;
        }
    }
}