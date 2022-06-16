module.exports = {
    noDataParticle: `'${Object.entries(require('./particles.json')).filter(([key, value]) => !value.requiresData).map(([key, value]) => key).join("' | '")}'`
}