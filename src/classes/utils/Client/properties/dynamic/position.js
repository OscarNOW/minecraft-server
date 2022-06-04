const { ChangablePosition } = require('../../../ChangablePosition.js')

module.exports = {
    position: {
        get: function () {
            return this[this.ps._position]
        },
        set: function ({ x, y, z, yaw, pitch }) {
            if (!this[this.ps.canUsed])
                throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to receive this packet.' : 'This is because the Client is no longer online'}`)

            this[this.ps.sendPacket]('position', {
                x: x ?? this.position.x,
                y: y ?? this.position.y,
                z: z ?? this.position.z,
                yaw: yaw ?? this.position.yaw,
                pitch: pitch ?? this.position.pitch,
                flags: 0x00
            });
        },
        init: function () {
            this[this.ps._position] = new ChangablePosition((function (i) { this.position = i }).bind(this), {
                x: null,
                y: null,
                z: null,
                yaw: null,
                pitch: null
            });
        }
    }
}