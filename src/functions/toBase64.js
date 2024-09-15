module.exports = {
    toBase64: inp => {
        return Buffer.from(inp).toString('base64');
    }
}