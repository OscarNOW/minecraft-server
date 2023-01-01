const { convertToType } = require('../functions/convertToType.js');
const languages = require('./languages.json');

module.exports = {
    langCode: convertToType(Object.keys(languages)),
    langEnglishName: convertToType(Object.values(languages).map(({ englishName }) => englishName)),
    langMenuName: convertToType(Object.values(languages).map(({ menuName }) => menuName)),
    langVersion: convertToType(Object.values(languages).map(({ version }) => version).filter(a => a !== undefined)),
    langRegion: convertToType(Object.values(languages).map(({ region }) => region).filter(a => a !== undefined))
}