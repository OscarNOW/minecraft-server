module.exports = {
    observe: [
        {
            code: `client.observe('slot', slot => console.log(\`Client switched slot to \${slot}\`))`
        }
    ]
}