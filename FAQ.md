# Frequently Asked Questions

- [Frequently Asked Questions](#frequently-asked-questions)
  - [The client is stuck on the screen "loading terrain..."](#the-client-is-stuck-on-the-screen-loading-terrain)
  - [How do I get the client to spawn at a certain location?](#how-do-i-get-the-client-to-spawn-at-a-certain-location)
  - [How do I create different default properties for different clients?](#how-do-i-create-different-default-properties-for-different-clients)

## The client is stuck on the screen "loading terrain..."
In order for the Client to spawn in the world, you need to call the loadWorld method. Here's an example:
```js
server.on('join', client => {
    //Here you can send chunks, spawn entities, listen for events, etc

    client.loadWorld()
})
```

You can specify the spawn position like this:
```js
const { Server } = require('minecraft-server')
const server = new Server({
    defaultClientProperties: () => ({
        position: {
            x: 10,
            y: 20,
            z: 5
        }
    })
})

server.on('join', client => {
    client.loadWorld()
})
```

## How do I get the client to spawn at a certain location?
See [The client is stuck on the screen "loading terrain..."](#the-client-is-stuck-on-the-screen-loading-terrain)

## How do I create different default properties for different clients?
Like this:
```js
const { Server } = require('minecraft-server')
const server = new Server({
    defaultClientProperties: client => ({
        gamemode: client.username == 'notch' ? 'creative' : 'survival'
    })
})
```