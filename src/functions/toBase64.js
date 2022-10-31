module.exports = Object.freeze({
    toBase64: inp => {
        return Buffer.from(inp).toString('base64');
    }
})