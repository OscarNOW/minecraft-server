module.exports = {
    methods: {
        animation: [
            {
                code: `
entity.animation('flashRed')
`
            },
            {
                code: `
entity.animation('critical')
`
            }
        ]
    },
    properties: {
        living: [
            {
                code: `
console.log(entity.living)
`
            }
        ]
    }
}