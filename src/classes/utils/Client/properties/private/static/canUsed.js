module.exports = {
    canUsed: () => false,
    readyStates: () => ({
        socketOpen: false,
        clientSettings: false
    }),
    joinedPacketSent: () => false,
    leftPacketSent: () => false
}