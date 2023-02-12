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

| :warning: WARNING: This package is not finished and does not cover the full Minecraft protocol yet. It only covers parts of the 1.16.3 protocol. To check what parts of the protocol are covered, see the [docs](https://oscarnow.github.io/minecraft-server/). New package updates will change the API and add more coverage. |
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
1. Join the server with Minecraft Java Edition version `1.16.3` on host `localhost` and on port `25565`. Different versions and ports are currently not supported.

If you want to now how to use the rest of the library, please see [the documentation](https://oscarnow.github.io/minecraft-server/).

For more examples, please see [the examples folder](https://github.com/OscarNOW/minecraft-server/tree/main/examples).

If you have any questions please first read the [FAQ](https://github.com/OscarNOW/minecraft-server/blob/main/FAQ.md). If your question isn't in there, you can [ask a question in discussions](https://github.com/OscarNOW/minecraft-server/discussions/new?category=questions).

## Key features

* **Fast**, starting a server with this library is way faster than using the default Java server.
* **Easy to use**, you can create servers in an intuitive way.
* **Everything is per Client**, meaning you can send different information to different Clients.

## **Terms**
These are some terms that are used in the code and documentation.

### Client
The Client is the system that is connecting/connected to the Server.

[Link to latest docs for Client](https://oscarnow.github.io/minecraft-server/classes/Client)

### Player
A player is just a type of [Entity](#entity). It is the thing that a [Client](#client) sees, when they see other people. Each [Client](#client) has it's own players. Here's an example:

* Notch ([Client](#client))
    * jeb_ (Player)
* jeb_ ([Client](#player))
    * Notch (Player)

In this case, there are two [Clients](#client) online; `Notch` and `jeb_` (top level) and they both see one another. A Player doesn't have to be a [Client](#client), it could also just look like one, without being actually connected to the server. Here's an example of that:

* Notch ([Client](#client))
    * jeb_ (Player)
    * Hub (Player)
* jeb_ ([Client](#player))
    * Hub (Player)

Here `Notch` sees `jeb_`, but `jeb_` doesn't see `Notch`. Both `jeb_` and `Notch` see the Player (not connected to the server) `Hub`. Hub isn't a [Client](#client) that is connected to the server, but looks like one to `Notch` and `jeb_`.

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

![Explanation of ISC license](https://github.com/OscarNOW/minecraft-server/blob/main/assets/ISC%20license/github/light.png?raw=true#gh-light-mode-only)

## **Special thanks**
* [wiki.vg](https://wiki.vg) for documenting the full Minecraft protocol.
* [minecraft-protocol](https://github.com/PrismarineJS/node-minecraft-protocol) for parsing all the packets and helping with the login process.
* [All the contributors](https://github.com/OscarNOW/minecraft-server/graphs/contributors) for helping improve the package.
* [Typedoc](https://typedoc.org/) for generating part of the documentation.