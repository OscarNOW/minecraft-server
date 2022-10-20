# ![Banner Image](https://github.com/OscarNOW/minecraft-server/blob/main/assets/Minecraft%20Server.png?raw=true)

<p align="center">
    <a href="https://www.npmjs.com/package/@boem312/minecraft-server">
        <img src="https://img.shields.io/npm/dt/@boem312/minecraft-server" alt="NPM downloads">
    </a>
    <a href="https://github.com/OscarNOW/minecraft-server/graphs/contributors">
        <img src="https://img.shields.io/github/contributors/OscarNOW/minecraft-server" alt="Github contributors">
    </a>
    <a href="https://vscode.dev/github/OscarNOW/minecraft-server">
        <img src="https://img.shields.io/badge/open%20in-vscode-brightgreen" alt="Open in vscode">
    </a>
</p>

[Github](https://github.com/OscarNOW/minecraft-server/)
[NPM](https://www.npmjs.com/package/minecraft-server)
[Docs](https://oscarnow.github.io/minecraft-server/)

| ⚠ WARNING: This package is not finished and does not cover the full Minecraft protocol yet. It only covers parts of the 1.16.3 protocol. To check what parts of the protocol are covered, see the [docs](https://oscarnow.github.io/minecraft-server/). New package updates will change the API and add more coverage. |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

Create Minecraft Servers with an easy to use API and with full control

This is a library that gives you access to an easy to use API that you can use to create Minecraft Java Edition servers. This package includes types so that your IDE has autocomplete. You have full control over the protocol and everything that is being sent to the client in an easy way. This means you have full control of what is being sent to each Client, and that you can send different information to different Clients.

## **Installation and usage**
1. Install with `npm i @boem312/minecraft-server`.
2. Now you can use the library. Here's an example code:
```js
const { Server } = require('@boem312/minecraft-server');
const server = new Server();

server.on('connect', client => {

    console.log(`${client.username} joined`);
    client.chat(`Hello world, ${client.username}`);

});
```
3. Join the server with Minecraft Java Edition version `1.16.3` on port `25565`. Different versions and ports are currently not supported.

If you want to now how to use the rest of the library, please see [the documentation](https://oscarnow.github.io/minecraft-server/).

For more examples, please see [the examples folder](https://github.com/OscarNOW/minecraft-server/tree/main/examples).

If you have any questions please first read the [FAQ](https://github.com/OscarNOW/minecraft-server/blob/main/FAQ.md). If your question isn't in there, you can [ask a question in discussions](https://github.com/OscarNOW/minecraft-server/discussions/new?category=questions).

## Goals
Not all goals are fully finished.

* **Full protocol coverage**, every packet is implemented in the library with an easy to use API.
* **Everything is per Client**, meaning you can, for example, have different server lists, or different worlds based on the Client.
* **Easy to use**, you can create servers in an intuitive way.

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

## **Contributing**
See [contributing.md](https://github.com/OscarNOW/minecraft-server/blob/main/contributing.md)

## **License**
For the full license, see [`license.md`](https://github.com/OscarNOW/minecraft-server/blob/main/license.md). This package uses [the ISC license](https://opensource.org/licenses/ISC).


<div class="darkImg"><img loading="lazy" src="./assets/ISC license/docs/dark.png" alt="ISC License explanation"></div>
<div class="lightImg"><img loading="lazy" src="./assets/ISC license/docs/light.png" alt="ISC License explanation"></div>


## **Special thanks**
* [wiki.vg](https://wiki.vg) for documenting the full Minecraft protocol.
* [minecraft-protocol](https://github.com/PrismarineJS/node-minecraft-protocol) for parsing all the packets and helping with the login process.
* [All the contributors](https://github.com/OscarNOW/minecraft-server/graphs/contributors) for helping improve the package.