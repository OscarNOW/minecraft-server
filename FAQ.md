# Frequently Asked Questions

- [Frequently Asked Questions](#frequently-asked-questions)
  - [How do I get the client to spawn at a certain location?](#how-do-i-get-the-client-to-spawn-at-a-certain-location)
  - [How do I create a different spawn location for different clients?](#how-do-i-create-a-different-spawn-location-for-different-clients)

## How do I get the client to spawn at a certain location?
```js
const { Server } = require('minecraft-server')
const server = new Server({
    defaultClientProperties: client => ({
        position: {
            x: 10,
            y: 20,
            z: 5
        }
    })
})
```

## How do I create a different spawn location for different clients?
```js
const { Server } = require('minecraft-server')
const server = new Server({
    defaultClientProperties: client => ({
        gamemode: client.username == 'notch' ? 'creative' : 'survival'
    })
})
```