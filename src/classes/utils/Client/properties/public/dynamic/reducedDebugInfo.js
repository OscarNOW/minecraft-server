const { defaults } = require('../../../../../../settings.json');
const CustomError = require('../../../../CustomError.js');

module.exports = {
    reducedDebugInfo: {
        info: {
            loginPacket: [
                'reducedDebugInfo'
            ]
        },
        get: function () {
            return this.p._reducedDebugInfo
        },
        setRaw: function (value, loginPacket) {
            if (typeof value != 'boolean')
                this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `reducedDebugInfo in  <${this.constructor.name}>.reducedDebugInfo = ${require('util').inspect(value)}  `, {
                    got: value,
                    expectationType: 'type',
                    expectation: 'boolean'
                }, null, { server: this.server, client: this }));

            this.p._reducedDebugInfo = value;

            if (loginPacket)
                return { reducedDebugInfo: value }
            else
                throw new Error(`Can't set "reducedDebugInfo"`)
        },
        init: function () {
            this.p._reducedDebugInfo = defaults.reducedDebugInfo;
        }
    }
}