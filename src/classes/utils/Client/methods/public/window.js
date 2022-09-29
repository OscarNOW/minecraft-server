const { windows } = require('../../../../../functions/loader/data.js');
const nonEntityWindowIdMapping = windows.filter(({ name }) => name != 'horse')

const CustomError = require('../../../CustomError.js');

module.exports = function (nonEntityWindowName) {
    this.p.stateHandler.checkReady.call(this);

    if (!nonEntityWindowIdMapping.find(({ name }) => name == nonEntityWindowName))
        this.p.emitError(new CustomError('expectationNotMet', 'libraryUser', `nonEntityWindowName in  <${this.constructor.name}>.window(${require('util').inspect(nonEntityWindowName)}, ...)  `, {
            got: nonEntityWindowName,
            expectationType: 'value',
            expectation: Object.keys(nonEntityWindowIdMapping)
        }, this.window))

    // let windowTypeId = nonEntityWindowIdMapping.find(({ name }) => name == nonEntityWindowName).id;
    // const windowId = 1; //could be anything except 0
    // this.p.windowId = windowId;

    throw new Error(`Not implemented`)
}