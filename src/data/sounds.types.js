module.exports = {
    soundName: `'${require('./sounds.json').map(a => a.name).join("' | '")}'`
}