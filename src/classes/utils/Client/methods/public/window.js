// const { windows } = require('../../../../../functions/loader/data.js');
// const nonEntityWindowIdMapping = windows.filter(({ name }) => name !== 'horse')

module.exports = function (nonEntityWindowName) {
    if (!this.p.stateHandler.checkReady.call(this))
        return;

    // if (!nonEntityWindowIdMapping.find(({ name }) => name === nonEntityWindowName))
    // throw new Error();

    // let windowTypeId = nonEntityWindowIdMapping.find(({ name }) => name === nonEntityWindowName).id;
    // const windowId = 1; //could be anything except 0
    // this.p.windowId = windowId;

    throw new Error('Not implemented');
}