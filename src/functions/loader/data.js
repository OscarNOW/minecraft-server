const JSON5 = require('JSON5');
const fs = require('fs');
const path = require('path');

let data = {};

fs.readdirSync(path.resolve(__dirname, '../../data/static/')).forEach(file => {
    data[file.split('.json')[0]] = JSON5.parse(fs.readFileSync(path.resolve(__dirname, `../../data/static/${file}`)).toString())
})

module.exports = Object.freeze({ ...data });