const fs = require('fs');
const path = require('path');
let files = [];

files = [...files, ...fs
    .readdirSync(path.resolve(__dirname, '../../classes/exports/'))
    .filter(a => a.split('.').length === 2)
    .filter(a => fs.existsSync(path.resolve(__dirname, `../../classes/exports/${a.split('.js')[0]}.test.js`)))
    .map(a => ({
        class: a.split('.js')[0],
        test: require(`../../classes/exports/${a.split('.js')[0]}.test.js`)
    }))
]

files = [...files, ...fs
    .readdirSync(path.resolve(__dirname, '../../classes/utils/'))
    .filter(a => a.split('.').length === 2)
    .filter(a => fs.existsSync(path.resolve(__dirname, `../../classes/utils/${a.split('.js')[0]}.test.js`)))
    .map(a => ({
        class: a.split('.js')[0],
        test: require(`../../classes/utils/${a.split('.js')[0]}.test.js`)
    }))
]

module.exports = Object.freeze(files);