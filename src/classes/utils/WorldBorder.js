const Changable = require('./Changable.js');

const defaultWorldBorder = require('../../data/worldBorder.json');

const path = require('path');

const _p = Symbol('private');
const defaultPrivate = {
    _radius: defaultWorldBorder.radius,
    _warningSeconds: defaultWorldBorder.warningSeconds,
    _warningBlocks: defaultWorldBorder.warningBlocks,
    updateCenter({ x, z } = {}) {
        const newCenter = {
            x: x ?? this.p._center.x,
            z: z ?? this.p._center.z
        };

        this.p._center.setRaw(newCenter);
        this.p.sendPacket('world_border', {
            action: 2,
            x: this.p._center.x,
            z: this.p._center.z
        });
    }
};

class WorldBorder {
    constructor(client, sendPacket) {
        Object.defineProperty(this, _p, {
            configurable: false,
            enumerable: false,
            writable: false,
            value: Object.assign({}, defaultPrivate)
        });

        this.client = client;
        this.server = client.server;
        this.p.sendPacket = sendPacket;

        this.p._center = new Changable((value, oldValue) => this.p.updateCenter(value, oldValue), defaultWorldBorder.center);
    }

    reset() {
        this.p.sendPacket('world_border', {
            action: 3,
            x: 0,
            z: 0,
            old_radius: this.p._radius,
            new_radius: defaultWorldBorder.radius,
            speed: 0,
            portalBoundary: defaultWorldBorder.portalBoundary,
            warning_time: defaultWorldBorder.warningSeconds,
            warning_blocks: defaultWorldBorder.warningBlocks
        });
    }

    get center() {
        return this.p._center;
    }

    set center(newValue) {
        let oldValue = this.center.raw; // "get <Changable>.raw" returns a copy of the object
        this.position.setRaw(newValue);

        this.p.updateCenter(newValue, oldValue);
    }

    get p() {
        let callPath = new Error().stack.split('\n')[2];

        if (callPath.includes('('))
            callPath = callPath.split('(')[1].split(')')[0];
        else
            callPath = callPath.split('at ')[1];

        callPath = callPath.split(':').slice(0, 2).join(':');

        let folderPath = path.resolve(__dirname, '../../');

        if (!callPath.startsWith(folderPath))
            console.warn('(minecraft-server) WARNING: Detected access to private properties from outside of the module. This is not recommended and may cause unexpected behavior.');

        return this[_p];
    }

    set p(value) {
        console.error('(minecraft-server) ERROR: Setting private properties is not supported. Action ignored.');
    }
}

module.exports = WorldBorder;