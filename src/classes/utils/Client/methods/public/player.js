module.exports = {
    player: function () {
        throw new Error(`Not implemented`)

        if (!this.p.canUsed)
            if (this.online)
                throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
            else
                throw new Error(`Can't perform this action on an offline player`)

        /*httpRequest({
            host: 'sessionserver.mojang.com',
            method: 'GET',
            path: `/session/minecraft/profile/${this.uuid}?unsigned=false`
        }).then(inf => {
            console.log(inf.properties)*/
        this.p.sendPacket('player_info', {
            action: 0,
            data: [
                {
                    UUID: this.uuid,
                    name: this.username,
                    // properties: inf.properties,
                    properties: [],
                    gamemode: 0,
                    ping: this.ping,
                    displayName: this.username
                }
            ]
        })
        // })
    }
}