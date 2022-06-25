const { version } = require('../../settings.json')

const pChunk = require('prismarine-chunk')(version);
const { Vec3 } = require('vec3');

const JSON5 = require('JSON5');
const fs = require('fs')
const path = require('path')
const blocks = JSON5.parse(fs.readFileSync(path.resolve(__dirname, '../../data/blocks.json')).toString())

class Chunk {
    constructor() {
        this._chunk = new pChunk();

        for (let x = 0; x < 16; x++)
            for (let z = 0; z < 16; z++)
                for (let y = 0; y < 256; y++)
                    this._chunk.setSkyLight(new Vec3(x, y, z), 15)
    }

    setBlock({ x, y, z }, blockName, state = {}) {
        this._chunk.setBlockStateId(new Vec3(x, y, z), getStateId(blockName, state));

        return this;
    }
}

function getStateId(blockName, state = {}) {
    let block = getBlock(blockName)
    if (!block.states) return block.minStateId;

    let stateIds = [];
    block.states.forEach(({ name, values }) => {
        if (state[name] === undefined) throw new Error(`Expected "${name}" state for block "${blockName}", expected one of ${require('util').inspect(values, { color: true })}, but got "${state[name]}" (${typeof state[name]})`)
        if (values.indexOf(state[name]) === -1) throw new Error(`Unknown "${name}" state for block "${blockName}" , expected one of ${require('util').inspect(values, { color: true })}, but got "${state[name]}" (${typeof state[name]})`)

        stateIds.push(values.indexOf(state[name]))
    })

    let maxi = block.states.map(a => a.values.length)

    let stateId = block.minStateId;

    stateIds.forEach((currentStateId, currentStateIdIndex) => {
        let maxiBefore = maxi.slice(0, currentStateIdIndex)
        let currentStateIdAndBefore = currentStateId;

        maxiBefore.forEach(a => currentStateIdAndBefore *= a)

        stateId += currentStateIdAndBefore
    })

    return stateId
}

function getBlock(blockName) {
    let block = blocks.find(({ name }) => name == blockName)
    if (block) return block

    throw new Error(`Unknown blockName "${blockName}" (${typeof blockName})`);
}

module.exports = Object.freeze({ Chunk });