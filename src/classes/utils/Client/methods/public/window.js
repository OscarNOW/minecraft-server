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

    // let windowId = nonEntityWindowIdMapping.find(({ name }) => name == nonEntityWindowName).id;
    // this.p.windowId = windowId;

    throw new Error(`Not implemented`)
}