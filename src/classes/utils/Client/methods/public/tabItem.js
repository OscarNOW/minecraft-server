const TabItem = require('../../../TabItem.js');

module.exports = function (tabItemOptions) {
    //todo: check input and emit CustomError if not correct

    let tabItem = new TabItem(tabItemOptions);

    return tabItem;
}