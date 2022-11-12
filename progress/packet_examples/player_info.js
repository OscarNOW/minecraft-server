let properties = [];
if (this.skinLookup) {
    let response;
    try {
        response = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${this.uuid}?unsigned=false`);
        const p = await response.json();
        properties = p?.properties ?? [];
        if (properties?.length !== 1) {
            console.warn('Skin lookup failed for', this.uuid);
        }
    }
    catch (err) {
        console.error('Skin lookup failed', err, response);
    }
}
// console.info('Player profile', p)
client.write('player_info', {
    action: 0,
    data: [{
        UUID: this.uuid,
        name: this.name,
        properties: properties,
        gamemode: FakePlayer.gameModeToNotchian(this.bot.game.gameMode),
        ping: 0
    }]
});