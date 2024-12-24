const { defaults } = require('../../../../../../settings.json');

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
        get() {
            return this.p._reducedDebugInfo;
        },
        set(newValue, beforeReady, loginPacket) {
            if ((!beforeReady) && (!this.p.stateHandler.checkReady.call(this)))
                return;

            if (typeof newValue !== 'boolean')
                throw new Error(`Expected reducedDebugInfo to be a boolean, received ${newValue} (${typeof newValue})`);

            this.p._reducedDebugInfo = newValue;

            if (loginPacket)
                return { reducedDebugInfo: newValue }
        },
        init() {
            this.p._reducedDebugInfo = defaults.reducedDebugInfo;
        }
    }
}