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
                throw new Error(`Unknown reducedDebugInfo, expected a boolean, received "${value}" (${typeof value})`)

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