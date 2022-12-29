module.exports = {
    textures() {
        let minecraftTextures = JSON.parse(Buffer.from(this.p.client.profile.properties[0].value, 'base64').toString()).textures;

        let textures = {
            skin: minecraftTextures.SKIN.url
        };

        if (minecraftTextures.CAPE) textures.cape = minecraftTextures.CAPE.url;
        Object.freeze(textures);

        return textures;
    }
}