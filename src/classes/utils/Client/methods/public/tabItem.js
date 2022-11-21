const TabItem = require('../../../TabItem.js');

module.exports = function (tabItemOptions) {
    //todo: check input and emit CustomError if not correct
    return new TabItem(tabItemOptions, this, this.p.sendPacket);
}