const { Text } = require('../../../../exports/Text.js');

module.exports = {
    kick: function (reason) {
        if (!this.p.canUsed)
            if (this.online)
                throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
            else
                throw new Error(`Can't perform this action on an offline player`)

        if (!(reason instanceof Text))
            reason = new Text(reason);

        this.p.client.end(0, JSON.stringify(reason.chat));
    }
}