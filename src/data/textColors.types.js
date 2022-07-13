module.exports = {
    textColor: `'${[...require('./textColors.json').map(a => a.name), 'default'].join("' | '")}'`
}