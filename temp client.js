const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
    host: 'localhost', // minecraft server ip
    username: 'oscarknap@ziggo.nl', // minecraft username
    password: 'Ik weet het niet!', // minecraft password, comment out if you want to log into online-mode=false servers
    // port: 25565,                // only set if you need a port that isn't 25565
    version: '1.16.3',             // only set if you need a specific version or snapshot (ie: "1.8.9" or "1.16.5"), otherwise it's set automatically
    auth: 'microsoft'              // only set if you need microsoft auth, then set this to 'microsoft'
})

bot.on('chat', (username, message) => {
    console.log(`${username}: ${message}`)
})

bot.on('login', () => console.log('logged in'))
bot.on('playerJoined', i => console.log(`${i} joined`))

// Log errors and kick reasons:
bot.on('kicked', console.log)
bot.on('error', console.log)