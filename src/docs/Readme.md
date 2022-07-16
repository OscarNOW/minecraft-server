# ![Minecraft Server](/minecraft-server/assets/Minecraft%20Server.png)

<p align="center">
    <img src="https://img.shields.io/npm/dt/minecraft-server" alt="NPM downloads">
    <img src="https://img.shields.io/github/contributors/OscarNOW/minecraft-server" alt="Github contributors">
    <a href="https://vscode.dev/github/OscarNOW/minecraft-server">
        <img src="https://img.shields.io/badge/open%20in-vscode-brightgreen" alt="Open in vscode">
    </a>
</p>

[Github](https://github.com/OscarNOW/minecraft-server/)
[NPM](https://www.npmjs.com/package/minecraft-server)
[Docs](https://oscarnow.github.io/minecraft-server/)

| ⚠ WARNING: The only current supported Minecraft version for this library is `1.16.3` |
| -------------------------------------------------------------------------------------------- |

Create Minecraft Servers with an easy to use API and with full control.

This is a library that gives you access to an easy to use API that you can use to create Minecraft Java Edition servers. This library includes types. You have full control over the protocol and everything that is being sent to the client in an easy way. This means you can customize everything, and that it's very easy to have different clients see completely different things. However, when you have full control over everything that's being sent to the client, it's more difficult to make a vanilla Minecraft server, because you have to create all the server-side logic yourself.

## **Installation and usage**
1. Install with npm by running `npm i minecraft-server`
1. Example code:
```js
const { Server } = require('minecraft-server');
const server = new Server();

server.on('join', client => {

    console.log(`${client.username} joined`);
    client.on('chat', message => console.log(`<${client.username}> ${message}`));

    client.loadWorld();
    client.chat(`Welcome to the server, ${client.username}!`);

});
```

For more examples, please see [the examples folder](https://github.com/OscarNOW/minecraft-server/tree/main/examples).

If you have any questions please first read the [FAQ](https://github.com/OscarNOW/minecraft-server/blob/main/FAQ.md). If your question isn't in there, you can [ask a question in discussions](https://github.com/OscarNOW/minecraft-server/discussions/new?category=questions).

## **Terms**

### Client
A client is a person that is (going to be) connected to the server.

### Player
A player is just a type of [entity](#entity). It is the thing that a [client](#client) sees, when they see other people. Each [client](#client) has it's own players. Here's an example: 

* Notch ([Client](#client))
    * jeb_ (Player)
* jeb_ ([Client](#player))
    * Notch (Player)

In this case, there are two [Clients](#client) online; `Notch` and `jeb_` and they both see eachother. A player doesn't have to be a [client](#client), it could also be a [NPC](#npc). Here's an example of that:

* Notch ([Client](#client))
    * jeb_ (Player)
    * Hub (Player)
* jeb_ ([Client](#player))
    * Hub (Player)

Here `Notch` sees `jeb_`, but `jeb_` doesn't see `Notch`. Both `jeb_` and `Notch` see the [NPC](#npc) `Hub`. Hub isn't a [Client](#client) that is connected to the server, but is seen by `Notch` and `jeb_` as a player.

### NPC
Non player character, a [player](#player) who appears as a real human, but is just virtual and isn't connected to the server.

### Entity
Entities include all dynamic, moving objects throughout the Minecraft world. Some examples of entities are:
* Pigs
* Armor stands
* Minecarts
* [Players](#player)
* Falling blocks

## Contribute
If this is your first time contributing to an open-source project, don't worry. We'll help you through the whole process. If you have any questions, please let us know!

### Expectations
If you want to contribute, whether it's a new feature or bug fix, make sure you first search if there already is an issue open for your contribution.

If you want to add a new feature to the library, first, make sure to first create an issue that explains the new feature. Then if it's approved and if you want to, create a pull request that resolves the issue. You don't actually have to implement the feature yourself.

### Security vulnerability
If you found a security vulnerability, please do not make a public issue. Instead [create a new security advisory](https://github.com/OscarNOW/minecraft-server/security/advisories/new). For more information, please see [`SECURITY.md`](https://github.com/OscarNOW/minecraft-server/blob/main/SECURITY.md).

## License
For the full license, see [`license.md`](https://github.com/OscarNOW/minecraft-server/blob/main/license.md).This library uses [the ISC license](https://opensource.org/licenses/ISC).


<div class="darkImg"><img loading="lazy" src="/minecraft-server/assets/ISC license/docs/dark.png" alt="ISC License explanation"></div> 
<div class="lightImg"><img loading="lazy" src="/minecraft-server/assets/ISC license/docs/light.png" alt="ISC License explanation"></div>


## Special thanks
* [wiki.vg](https://wiki.vg) for documenting the full Minecraft protocol.
* [minecraft-protocol](https://github.com/PrismarineJS/node-minecraft-protocol) for parsing all the packets and helping with the login process.
* [All the contributors](https://github.com/OscarNOW/minecraft-server/graphs/contributors) for helping improve the library.