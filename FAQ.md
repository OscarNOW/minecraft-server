# Frequently Asked Questions

- [Frequently Asked Questions](#frequently-asked-questions)
  - [How do I get the client to spawn at a certain location?](#how-do-i-get-the-client-to-spawn-at-a-certain-location)
  - [How do I set a different spawn location for different clients?](#how-do-i-set-a-different-spawn-location-for-different-clients)

## How do I get the client to spawn at a certain location?
```js
const { Server } = require('@boem312/minecraft-server')
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

## How do I set a different spawn location for different clients?
```js
const { Server } = require('@boem312/minecraft-server')
const server = new Server({
    defaultClientProperties: client => ({
        position: client.username === 'notch' ? {
            x: 3,
            y: 100,
            z: 3
        } : {
            x: 3,
            y: 0,
            z: 3
        }
    })
})
```