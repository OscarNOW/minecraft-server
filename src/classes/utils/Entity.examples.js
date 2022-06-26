module.exports = {
    properties: {
        living: [
            {
                code: `
console.log(entity.living)
`
            },
            {
                code: `
client.chat(entity.living)
`
            }
        ]
    }
}