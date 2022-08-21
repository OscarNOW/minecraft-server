const { demoMessages } = require('../../../../../functions/loader/data.js');

const CustomError = require('../../../CustomError.js');

module.exports = {
    demo: function (message) {
        this.p.stateHandler.checkReady.call(this);

        if (demoMessages[message] === undefined)
            throw new CustomError('expectationNotMet', 'libraryUser', `message in  <${this.constructor.name}>.demo(${require('util').inspect(message)})  `, {
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