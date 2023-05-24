const { timing: { teleportConfirmationTimeout }, defaults } = require('../../../../../../settings.json');

const Changeable = require('../../../../Changeable.js');
const CustomError = require('../../../../CustomError.js');

module.exports = {
    position: {
        info: {
            defaultable: true,
            defaultSetTime: 'afterLogin'
        },
        get() {
            return this.p._position;
        },
        set(pos = {}, beforeReady) {
            if (beforeReady) {
                for (const [key, value] of Object.entries(pos))
                    this.p._position.setRaw(key, value)

                this.p.oldPositions = Object.freeze({ // todo: rename <Client>.p.oldPositions to <Client>.p.lastPosition
                    x: this.p._position.x,
                    y: this.p._position.y,
                    z: this.p._position.z,
                    yaw: this.p._position.yaw,
                    pitch: this.p._position.pitch,
                    isFirst: true
                });
            } else {

                if (!this.p.stateHandler.checkReady.call(this))
                    return;

                let teleportId = Math.floor(Math.random() * 1000000);
                while (this.p.teleportPromises?.[teleportId])
                    teleportId = Math.floor(Math.random() * 1000000);

                new Promise((res, rej) => {
                    let obj = this.p.teleportPromises || {};
                    obj[teleportId] = {
                        res,
                        rej,
                        resolved: false
                    }

                    this.p.teleportPromises = obj;

                    this.p.setTimeout(() => {
                        if (this.online && !this.p.teleportPromises[teleportId].resolved)
                            rej(new CustomError('expectationNotMet', 'client', `response in  <remote ${this.constructor.name}>.teleport_confirm(...)  `, {
                                got: 'no call',
                                expectationType: 'value',
                                expectation: ['call']
                            }, null, { server: this.server, client: this }))
                    }, teleportConfirmationTimeout)
                }).catch(e => this.p.emitError(e));

                let oldPosition = this.p.oldPositions; // todo: rename <Client>.p.oldPositions to <Client>.p.lastPosition
                let useRelative = '';
                let values = {};

                for (const key of [
                    'pitch',
                    'yaw',
                    'z',
                    'y',
                    'x'
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

                this.p.oldPositions = Object.freeze({ // todo: rename <Client>.p.oldPositions to <Client>.p.lastPosition
                    x: this.p._position.x,
                    y: this.p._position.y,
                    z: this.p._position.z,
                    yaw: this.p._position.yaw,
                    pitch: this.p._position.pitch,
                    isFirst: false
                });

            }
        },
        init() {
            this.p.positionSet = false;
            this.p._position = new Changeable((function (i) { this.position = i }).bind(this), defaults.position);

            this.p.oldPositions = Object.freeze({ // todo: rename <Client>.p.oldPositions to <Client>.p.lastPosition
                x: this.p._position.x,
                y: this.p._position.y,
                z: this.p._position.z,
                yaw: this.p._position.yaw,
                pitch: this.p._position.pitch,
                isFirst: true
            });
        },
        confirm(teleportId) {
            this.p.teleportPromises[teleportId].resolved = true;
            this.p.teleportPromises[teleportId].res();
        },
        update(position) {
            this.p.oldPositions = Object.freeze({ // todo: rename <Client>.p.oldPositions to <Client>.p.lastPosition
                x: position.x,
                y: position.y,
                z: position.z,
                yaw: position.yaw,
                pitch: position.pitch,
                isFirst: false
            });
        }
    }
}