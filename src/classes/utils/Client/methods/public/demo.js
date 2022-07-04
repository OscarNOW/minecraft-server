const { CustomError } = require('../../../CustomError.js');
const demoMessages = require('../../../../../data/demoMessages.json')

const wait = ms => new Promise(res => setTimeout(res, ms));

module.exports = {
    demo: function (message) {
        if (!this.p.canUsed)
            if (this.online)
                throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
            else
                throw new Error(`Can't perform this action on an offline player`)

        if (demoMessages[message] === undefined)
                /* -- Look at stack trace for location -- */ throw new
                CustomError('expectationNotMet', 'libraryUser', [
                    ['', 'message', ''],
                    ['in the function "', 'cooldown', '"'],
                    ['in the class ', this.constructor.name, ''],
                ], {
                    got: message,
                    expectationType: 'value',
                    expectation: Object.keys(demoMessages)
                }, this.demo).toString()

        this.p.sendPacket('game_state_change', {
            reason: 5,
            gameMode: demoMessages[message]
        })
    }
}