const fs = require('fs');
const path = require('path');
let data = {};

fs.readdirSync(path.resolve(__dirname, '../../data/')).forEach(file => {
    data[file.split('.json')[0]] = require(`../../data/${file}`)
})

module.exports = Object.freeze({ ...data });