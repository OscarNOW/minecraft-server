const { timing: { teleportConfirmationTimeout }, defaults } = require('../../../../../../settings.json');

const Changable = require('../../../../Changable.js');

const teleportPromises = new WeakMap();
const oldPositions = new WeakMap();

module.exports = {
    position: {
        info: {
            callAfterLogin: true
        },
        get: function () {
            return this.p._position
        },
        set: function (pos = {}) {
            if (!this.p.stateHandler.checkReady.call(this))
                return;

            let teleportId = Math.floor(Math.random() * 1000000);
            while (teleportPromises.get(this)?.[teleportId])
                teleportId = Math.floor(Math.random() * 1000000);

            new Promise((res, rej) => {
                let obj = teleportPromises.get(this) || {};
                obj[teleportId] = {
                    res,
                    rej,
                    resolved: false
                }

                teleportPromises.set(this, obj)

                this.p.setTimeout(() => {
                    if (this.online && !teleportPromises.get(this)[teleportId].resolved)
                        rej(new Error(`Client didn't send teleport confirm after sending client teleport`))
                }, teleportConfirmationTimeout)
            });

            let oldPosition = oldPositions.get(this);
            let useRelative = '';
            let values = {};

            for (const key of [
                'pitch',
                'yaw',
                'z',
                'y',
                'x',
            ]) {
                let val = pos[key] ?? oldPosition[key];

                if (oldPosition && (!oldPosition.isFirst) && (Math.abs(val - oldPosition[key]) < Math.abs(val))) {
                    useRelative += '1'
                    values[key] = val - oldPosition[key]
                } else {
                    useRelative += '0'
                    values[key] = val
                }
            };

            this.p.positionSet = true;

            this.p.sendPacket('position', {
                ...values,
                flags: parseInt(useRelative, 2),
                teleportId
            });

            oldPositions.set(this, Object.freeze({
                x: this.p._position.x,
                y: this.p._position.y,
                z: this.p._position.z,
                yaw: this.p._position.yaw,
                pitch: this.p._position.pitch,
                isFirst: false
            }));
        },
        setRaw: function (position = {}) {
            for (const [key, value] of Object.entries(position))
                this.p._position.setRaw(key, value)

            oldPositions.set(this, Object.freeze({
                x: this.p._position.x,
                y: this.p._position.y,
                z: this.p._position.z,
                yaw: this.p._position.yaw,
                pitch: this.p._position.pitch,
                isFirst: true
            }));
        },
        init: function () {
            this.p.positionSet = false;
            this.p._position = new Changable((function (i) { this.position = i }).bind(this), defaults.position);

            oldPositions.set(this, Object.freeze({
                x: this.p._position.x,
                y: this.p._position.y,
                z: this.p._position.z,
                yaw: this.p._position.yaw,
                pitch: this.p._position.pitch,
                isFirst: true
            }));
        },
        confirm: function (teleportId) {
            teleportPromises.get(this)[teleportId].resolved = true
            teleportPromises.get(this)[teleportId].res()
        },
        update(position) {
            oldPositions.set(this, Object.freeze({
                x: position.x,
                y: position.y,
                z: position.z,
                yaw: position.yaw,
                pitch: position.pitch,
                isFirst: false
            }));
        }
    }
}