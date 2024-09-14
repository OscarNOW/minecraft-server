const axios = require('axios').default;
const { timing: { skinFetchTimeout } } = require('../settings.json');

async function get(url) {
    const resp = await axios.get(url, { timeout: skinFetchTimeout });
    const data = await resp.data;

    return data;
}

let skinTexturesCache = {};
async function getSkinTextures(uuid) {
    if (skinTexturesCache[uuid])
        return skinTexturesCache[uuid];

    const isValidUuid = (typeof uuid === 'string') && uuid.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/g);
    let textures;

    if (!isValidUuid)
        textures = { properties: [] }
    else
        textures = await get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}?unsigned=false`);

    skinTexturesCache[uuid] = textures;
    return textures;
}

module.exports = { getSkinTextures };