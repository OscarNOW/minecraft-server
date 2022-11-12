const { blocks } = require('./loader/data.js');
const CustomError = require('../classes/utils/CustomError.js');

function getBlockStateId(blockName, state = {}, { function: func } = {}) {
    let block = getBlock.call(this, blockName, { function: func })
    if (!block[2]) return block[1];

    let stateIds = [];
    for (const { name, values } of block[2]) {
        if (values.indexOf(state[name]) === -1)
            throw new CustomError('expectationNotMet', 'libraryUser', `stateValue in   <${this.constructor.name}>.${func}(${require('util').inspect(blockName)}, ..., { ${name}: stateValue })  `, [true, false].sort().join(',') === values.sort().join(',') ? {
                got: state[name],
                expectationType: 'type',
                expectation: 'boolean'
            } : {
                got: state[name],
                expectationType: 'value',
                expectation: values
            }, func ? this[func] : getBlockStateId).toString()

        stateIds.push(values.indexOf(state[name]))
    }

    let maxi = block[2].map(a => a.values.length)

    let stateId = block[1];

    stateIds.forEach((currentStateId, currentStateIdIndex) => {
        let maxiBefore = maxi.slice(0, currentStateIdIndex)
        let currentStateIdAndBefore = currentStateId;

        for (const a of maxiBefore) currentStateIdAndBefore *= a

        stateId += currentStateIdAndBefore
    })

    return stateId
}

function getBlock(blockName, { function: func } = {}) {
    let block = blocks.find(a => a[0] === blockName)
    if (block) return block

    throw new CustomError('expectationNotMet', 'libraryUser', `blockName in  <${this.constructor.name}>.${func}(..., ${require('util').inspect(blockName)}, ...)  `, {
        got: blockName,
        expectationType: 'type',
        expectation: 'blockName',
        externalLink: '{docs}/types/blockName'
    }, func ? this[func] : getBlock).toString()
}

module.exports = Object.freeze({ getBlockStateId });