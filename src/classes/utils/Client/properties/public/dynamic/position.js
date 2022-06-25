const { Changable } = require('../../../../Changable.js');

const teleportPromises = new Map();

module.exports = {
    position: {
        get: function () {
            return this.p._position
        },
        set: function ({ x, y, z, yaw, pitch }) {
            if (!this.p.canUsed)
                if (this.online)
                    throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
                else
                    throw new Error(`Can't perform this action on an offline player`)

            const teleportId = Math.floor(Math.random() * 1000);
            const promise = new Promise((res, rej) => {
                let obj = teleportPromises.get(this) || {};
                obj[teleportId] = {
                    res,
                    rej,
                    resolved: false
                }

                teleportPromises.set(this, obj)

                setTimeout(() => {
                    if (!teleportPromises.get(this)[teleportId].resolved)
                        rej(new Error(`Client didn't send teleport confirm after sending client teleport`))
                }, 5000)
            })

            this.p.sendPacket('position', {
                x: x ?? this.position.x,
                y: y ?? this.position.y,
                z: z ?? this.position.z,
                yaw: yaw ?? this.position.yaw,
                pitch: pitch ?? this.position.pitch,
                flags: 0x00,
                teleportId
            });

            return promise;
        },
        init: function () {
            this.p._position = new Changable((function (i) { this.position = i }).bind(this), {
                x: null,
                y: null,
                z: null,
                yaw: null,
                pitch: null
            });
        },
        confirm: function (teleportId) {
            teleportPromises.get(this)[teleportId].resolved = true
            teleportPromises.get(this)[teleportId].res()
        }
    }
}