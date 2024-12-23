const { blocks } = require('./loader/data.js');
const CustomError = require('../classes/utils/CustomError.js');

function getBlockStateId(blockName, state = {}, { function: func } = {}) {
    if (findInCache(blockName, state)) return findInCache(blockName, state);

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

    setInCache(blockName, state, stateId);
    return stateId;
}

const cache = {
    blockName: [
        {
            stateId: 1,
            state: {}
        }
    ]
};

function findInCache(oBlockName, oState) {
    if (!cache[oBlockName]) return null;

    for (const { stateId, state } of cache[oBlockName])
        if (compareStates(state, oState))
            return stateId;

    return null;
}

//a compareState function that compares two states
function compareStates(state1, state2) {
    if (Object.keys(state1).length !== Object.keys(state2).length) return false;

    for (const key of Object.keys(state1))
        if (state1[key] !== state2[key]) return false;

    return true;
}

function setInCache(blockName, state, stateId) {
    if (findInCache(blockName, state) !== null) return;

    if (!cache[blockName]) cache[blockName] = [];
    cache[blockName].push({
        stateId,
        state
    });
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

module.exports = { getBlockStateId };