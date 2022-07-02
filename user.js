const { Server } = require('.')
const server = new Server({
    serverList: () => ({
        description: 'Hi'
    })
})