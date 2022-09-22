const { windowNameIdMapping } = require('../../../../../functions/loader/data.js');
const nonEntityWindowIdMapping = Object.fromEntries(Object.entries(windowNameIdMapping).filter(([windowName, windowId]) => windowName != 'horse'))

const CustomError = require('../../../CustomError.js');

module.exports = function (nonEntityWindowName, horse) {
    this.p.stateHandler.checkReady.call(this);

    if (!nonEntityWindowIdMapping[nonEntityWindowName])
        throw new CustomError('expectationNotMet', 'libraryUser', `nonEntityWindowName in  <${this.constructor.name}>.window(${require('util').inspect(nonEntityWindowName)}, ...)  `, {
            got: nonEntityWindowName,
            expectationType: 'value',
            expectation: Object.keys(nonEntityWindowIdMapping)
        }, this.window).toString()

    let windowId = nonEntityWindowIdMapping[nonEntityWindowName];

    throw new Error(`Not implemented`)
}