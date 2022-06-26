const fs = require('fs')
const path = require('path')

module.exports = {
    constructor: [
        {
            code: fs.readFileSync(path.resolve(__dirname, '../../../examples/simpleServer.js')).toString()
        },
        {
            code: fs.readFileSync(path.resolve(__dirname, '../../../examples/serverList_simple.js')).toString()
        },
        {
            code: fs.readFileSync(path.resolve(__dirname, '../../../examples/serverList_advanced.js')).toString()
        }
    ]
}