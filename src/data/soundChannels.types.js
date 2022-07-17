module.exports = {
    soundChannel: require('./soundChannels.json').map(a => `'${a}'`).join('|')
}