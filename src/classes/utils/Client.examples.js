const fs = require('fs')
const path = require('path')

let e = {
    constructor: [],
    methods: {},
    properties: {}
}

e.methods = {
    ...e.methods, ...fs
        .readdirSync(path.resolve(__dirname, './Client/methods/public'))
        .filter(a => a.endsWith('.examples.js'))
        .map(a => require(`./Client/methods/public/${a}`))
}

e.methods = {
    ...e.methods, ...fs
        .readdirSync(path.resolve(__dirname, './Client/methods/private'))
        .filter(a => a.endsWith('.examples.js'))
        .map(a => require(`./Client/methods/private/${a}`))
}

e.properties = {
    ...e.properties, ...fs
        .readdirSync(path.resolve(__dirname, './Client/properties/public/dynamic/'))
        .filter(a => a.endsWith('.examples.js'))
        .map(a => require(`./Client/properties/public/dynamic/${a}`))
}

e.properties = {
    ...e.properties, ...fs
        .readdirSync(path.resolve(__dirname, './Client/properties/public/static/'))
        .filter(a => a.endsWith('.examples.js'))
        .map(a => require(`./Client/properties/public/static/${a}`))
}

module.exports = e;