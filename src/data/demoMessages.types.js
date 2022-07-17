module.exports = {
    demoMessage: Object.keys(require('./demoMessages.json')).map(a => `'${a}'`).join('|')
}