const { version } = require('../../settings.json')
const { blocks } = require('../../functions/loader/data.js')

const pChunk = require('prismarine-chunk')(version);

const CustomError = require('../utils/CustomError.js');

class Chunk {
    constructor() {
        this._chunk = new pChunk();

        for (let x = 0; x < 16; x++)
            for (let z = 0; z < 16; z++)
                for (let y = 0; y < 256; y++)
                    this._chunk.setSkyLight({ x, y, z }, 15)
    }

    setBlock({ x, y, z }, blockName, state = {}) {
        this._chunk.setBlockStateId({ x, y, z }, getStateId.call(this, blockName, state, { function: 'setBlock' }));

        return this;
    }
}

function getStateId(blockName, state = {}, { function: func }) {
    let block = getBlock.call(this, blockName, { function: func })
    if (!block.states) return block.minStateId;

    let stateIds = [];
    for (const { name, values } of block.states) {
        if (values.indexOf(state[name]) === -1)
            throw new CustomError('expectationNotMet', 'libraryUser', [
                ['', 'state', ''],
                ['for the block "', blockName, '"'],
                ['in the function "', func, '"'],
                ['in the class ', this.constructor.name, ''],
            ], [true, false].sort().join(',') == values.sort().join(',') ? {
                got: state[name],
                expectationType: 'type',
                expectation: 'boolean'
            } : {
                got: state[name],
                expectationType: 'value',
                expectation: values
            }, this[func]).toString()

        stateIds.push(values.indexOf(state[name]))
    }

    let maxi = block.states.map(a => a.values.length)

    let stateId = block.minStateId;

    stateIds.forEach((currentStateId, currentStateIdIndex) => {
        let maxiBefore = maxi.slice(0, currentStateIdIndex)
        let currentStateIdAndBefore = currentStateId;

        for (const a of maxiBefore) currentStateIdAndBefore *= a

        stateId += currentStateIdAndBefore
    })

    return stateId
}

function getBlock(blockName, { function: func }) {
    let block = blocks.find(({ name }) => name == blockName)
    if (block) return block

    throw new CustomError('expectationNotMet', 'libraryUser', [
        ['', 'blockName', ''],
        ['in the function "', func, '"'],
        ['in the class ', this.constructor.name, ''],
    ], {
        got: blockName,
        expectationType: 'type',
        expectation: 'blockType',
        externalLink: '{docs}/types/blockType.html'
    }, this[func]).toString()
}

module.exports = Chunk;