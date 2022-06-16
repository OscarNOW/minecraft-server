module.exports = {
    win: function (showCredits) {
        if (!this.p.canUsed)
            if (this.online)
                throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
            else
                throw new Error(`Can't perform this action on an offline player`)

        if (!showCredits)
            throw new Error('Not implemented')

        this.p.sendPacket('game_state_change', {
            reason: 4,
            gameMode: showCredits ? 1 : 0
        })
    }
}