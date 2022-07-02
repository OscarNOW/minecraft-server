const { Server } = require('../')
const server = new Server({
    serverList: () => ({
        favicon: require('fs').readFileSync('./user/img/pen.png')
    })
})