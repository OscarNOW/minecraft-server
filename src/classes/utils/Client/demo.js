module.exports = {
    demo: function (message) {
        if (!this[this.ps.canUsed])
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

        let messages = {
            startScreen: 0,
            movement: 101,
            jump: 102,
            inventory: 103,
            endScreenshot: 104
        };

        if (messages[message] === undefined)
            throw new Error(`Unknown message "${message}" (${typeof message})`)

        this[this.ps.sendPacket]('game_state_change', {
            reason: 5,
            gameMode: messages[message]
        })
    }
}