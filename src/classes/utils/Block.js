const path = require('path');
const { getBlockStateId } = require('../../functions/getBlockStateId.js');

const _p = Symbol('_privates');

class Block {
    constructor(name, state = {}, { x, y, z }) {
        Object.defineProperty(this, _p, {
            configurable: false,
            enumerable: false,
            writable: false,
            value: {}
        });

        this.p._block = name;
        this.p._state = state;
        this.p._stateId = null;

        this.x = x;
        this.y = y;
        this.z = z;
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

    get stateId() {
        if (this.p._stateId === null)
            this.p._stateId = getBlockStateId(this.block, this.state);

        return this.p._stateId;
    }

    get block() {
        return this.p._block;
    }

    get state() {
        return this.p._state;
    }
}

module.exports = Block;