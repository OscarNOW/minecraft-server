const fs = require('fs');
const path = require('path');
let files = [];

fs.readdirSync(path.resolve(__dirname, '../../classes/exports/')).forEach(file => {
    if (file.split('.').length == 2)
        files.push({
            class: file.split('.js')[0],
            test: require(`../../classes/exports/${file.split('.js')[0]}.test.js`)
        })
})

fs.readdirSync(path.resolve(__dirname, '../../classes/utils/')).forEach(file => {
    if (file.split('.').length == 2)
        files.push({
            class: file.split('.js')[0],
            test: require(`../../classes/utils/${file.split('.js')[0]}.test.js`)
        })
})

module.exports = files;