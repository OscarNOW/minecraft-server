const { defaults } = require('../../../../../../settings.json');
const CustomError = require('../../../../CustomError.js');

module.exports = {
    reducedDebugInfo: {
        info: {
            preventSet: true,

            defaultable: true,
            defaultSetTime: 'loginPacket',
            loginPacket: [
                {
                    name: 'reducedDebugInfo',
                    minecraftName: 'reducedDebugInfo'
                }
            ]
        },
        get: function () {
            return this.p._reducedDebugInfo;
        },
        set: function (newValue, beforeReady, loginPacket) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            if (typeof newValue !== 'boolean')
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `reducedDebugInfo in  <${this.constructor.name}>.reducedDebugInfo = ${require('util').inspect(newValue)}  `, {
                    got: newValue,
                    expectationType: 'type',
                    expectation: 'boolean'
                }, null, { server: this.server, client: this }));

            this.p._reducedDebugInfo = newValue;

            if (loginPacket)
                return { reducedDebugInfo: newValue }
        },
        init: function () {
            this.p._reducedDebugInfo = defaults.reducedDebugInfo;
        }
    }
}