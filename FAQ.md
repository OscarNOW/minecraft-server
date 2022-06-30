# Frequently Asked Questions

- [Frequently Asked Questions](#frequently-asked-questions)
  - [The client is stuck on the screen "loading terrain..."](#the-client-is-stuck-on-the-screen-loading-terrain)
  - [What does client.position = {} mean?](#what-does-clientposition---mean)
  - [How do I get the client to spawn at a certain location?](#how-do-i-get-the-client-to-spawn-at-a-certain-location)

## The client is stuck on the screen "loading terrain..."
In order for the Client to spawn in the world, you need to set it's position when you sent all the chunks. Here's an example:
```js
server.on('join', client => {
    //Send chunks here (optional)

    client.position = {}
})
```

If you don't specify where to spawn the client in the `client.position = {}` line, it will spawn at `x: 0, y: 0, z: 0, yaw: 0, pitch: 0`. If you want the client to spawn at a different location, you can do that like this:
```js
server.on('join', client => {
    //Send chunks here (optional)

    client.position = {
        x: 10,
        y: 15,
        z: 5,
        yaw: 10,
        pitch: 2
    }
})
```

Every coordinate and rotation in the `client.position = {` is optional, if you don't specify them, everything you don't specify will default to 0.

## What does client.position = {} mean?
See [The client is stuck on the screen "loading terrain..."](#the-client-is-stuck-on-the-screen-loading-terrain)

## How do I get the client to spawn at a certain location?
See [The client is stuck on the screen "loading terrain..."](#the-client-is-stuck-on-the-screen-loading-terrain)