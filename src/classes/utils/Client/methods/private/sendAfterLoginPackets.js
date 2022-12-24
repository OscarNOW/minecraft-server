module.exports = {
    sendAfterLoginPackets() {
        for (const callback of
            Object.entries(this.p.defaultProperties)
                .map(([name, value]) => [this.p.pubDynProperties[name], value])
                .filter(([file]) => file.info?.callAfterLogin)
                .map(([file, value]) => () => file.setRaw.call(this, value, true))
        )
            callback();
    }
}