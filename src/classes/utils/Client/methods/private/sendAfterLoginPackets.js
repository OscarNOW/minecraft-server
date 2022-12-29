module.exports = {
    sendAfterLoginPackets() {
        for (const [file, value] of
            Object.entries(this.p.defaultProperties)
                .map(([name, value]) => [this.p.pubDynProperties[name], value])
                .filter(([file, value]) => [file.info?.callAfterLogin, value])
        )
            file.set.call(this, value, true);
    }
}