const { defaults } = require('../../../../../../settings.json');

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
                    /* -- Look at stack trace for location -- */ throw new
                    CustomError('expectationNotMet', 'libraryUser', [
                        ['', 'reducedDebugInfo', ''],
                        ['in the function "', 'setRaw reducedDebugInfo', '"'],
                        ['in the class ', this.constructor.name, ''],
                    ], {
                        got: value,
                        expectationType: 'type',
                        expectation: 'boolean'
                    }).toString()

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