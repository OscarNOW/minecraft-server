const fs = require('fs');
const path = require('path');
let e = {};
let utils = {};

fs.readdirSync(path.resolve(__dirname, '../../classes/exports/')).forEach(file => {
    if (file.split('.').length == 2)
        e = { ...e, ...require(`../../classes/exports/${file}`) }
})

fs.readdirSync(path.resolve(__dirname, '../../classes/utils/')).forEach(file => {
    if (file.split('.').length == 2)
        utils = { ...utils, ...require(`../../classes/utils/${file}`) }
})

module.exports = { exports: e, utils };