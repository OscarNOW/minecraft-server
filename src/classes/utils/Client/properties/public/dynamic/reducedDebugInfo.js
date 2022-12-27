const { defaults } = require('../../../../../../settings.json');
const CustomError = require('../../../../CustomError.js');

module.exports = {
    reducedDebugInfo: {
        info: {
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
        setRaw: function (newValue, loginPacket) {
            if (typeof newValue !== 'boolean')
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `reducedDebugInfo in  <${this.constructor.name}>.reducedDebugInfo = ${require('util').inspect(newValue)}  `, {
                    got: newValue,
                    expectationType: 'type',
                    expectation: 'boolean'
                }, null, { server: this.server, client: this }));

            this.p._reducedDebugInfo = newValue;

            if (loginPacket)
                return { reducedDebugInfo: newValue }
            else
                throw new Error(`Can't set "reducedDebugInfo"`) //todo: use CustomError
        },
        init: function () {
            this.p._reducedDebugInfo = defaults.reducedDebugInfo;
        }
    }
}