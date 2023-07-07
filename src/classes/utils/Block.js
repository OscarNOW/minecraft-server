const path = require('path');
const { getBlockStateId } = require('../../functions/getBlockStateId.js');

const _p = Symbol('_privates');

class Block {
    constructor(name, state = {}, { x, y, z }) {
        this._block = name;
        this._state = state;
        this._stateId = null;

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
        if (this._stateId === null)
            this._stateId = getBlockStateId(this.block, this.state);

        return this._stateId;
    }

    get block() {
        return this._block;
    }

    get state() {
        return this._state;
    }
}

module.exports = Block;