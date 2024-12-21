module.exports = {
    sendAfterLoginPackets() {
        for (const [name, file, value] of
            Object.entries(this.p.pubDynProperties)
                .filter(([key, value]) => value.info?.defaultable && value.info?.defaultSetTime === 'afterLogin')
                .map(([key, value]) => ([
                    key,
                    value,
                    Object.entries(this.p.defaultProperties).find(([key2, value2]) => key2 === key)?.[1]
                ]))
                .filter(([name, file, value]) => value !== undefined || file.info?.alwaysRequiresDefaultSet)
        )
            file.set.call(this, value === undefined ? this[name] : value, true);
    }
}