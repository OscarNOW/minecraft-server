module.exports = {
    foodSaturation: {
        get: function () {
            return this[this.ps._foodSaturation]
        },
        set: function (fs) {
            if (!this[this.ps.canUsed])
                throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

            const foodSaturation = parseInt(fs);

            if (isNaN(foodSaturation) || foodSaturation < 0 || foodSaturation > 5)
                throw new Error(`Unknown foodSaturation, expected an integer between 0 and 5, received "${fs}" (${typeof fs})`)

            this[this.ps.sendPacket]('update_health', {
                health: this[this.ps._health],
                food: this[this.ps._food],
                foodSaturation
            })

            this[this.ps._foodSaturation] = foodSaturation;
            this[this.ps.emitObservable]('foodSaturation');
        }
    }
}