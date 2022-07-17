module.exports = {
    entityAnimationType: Object.keys(require('./entityAnimations.json')).map(a => `'${a}'`).join('|')
}