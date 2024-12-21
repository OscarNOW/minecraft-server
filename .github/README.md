# ![Banner Image](https://github.com/OscarNOW/minecraft-server/blob/main/assets/Minecraft%20Server.png?raw=true)

**A pure JS library to create Minecraft Java 1.16.3 servers**

Resources:
[Github](https://github.com/OscarNOW/minecraft-server/)
[NPM](https://www.npmjs.com/package/minecraft-server)
[Docs](https://oscarnow.github.io/minecraft-server/)

<p align="center">
    <a href='https://codespaces.new/OscarNOW/minecraft-server'>
        <img src='https://github.com/codespaces/badge.svg' alt='Open in GitHub Codespaces'>
    </a>
    <a href="https://gitpod.io/#https://github.com/OscarNOW/minecraft-server">
        <img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in Gitpod">
    </a>
    <a href="https://vscode.dev/github/OscarNOW/minecraft-server">
        <img src="https://img.shields.io/badge/open%20in-vscode-brightgreen" alt="Open in vscode">
    </a>
    <a href="https://www.npmjs.com/package/@boem312/minecraft-server">
        <img src="https://img.shields.io/npm/dt/@boem312/minecraft-server" alt="NPM downloads">
    </a>
    <a href="https://github.com/OscarNOW/minecraft-server/graphs/contributors">
        <img src="https://img.shields.io/github/contributors/OscarNOW/minecraft-server" alt="Github contributors">
    </a>
</p>

| This package does not cover the full Minecraft Java protocol yet. It only covers parts of the 1.16.3 protocol. To check what parts of the protocol are covered, see the [Excel packet spreadsheet](https://github.com/OscarNOW/minecraft-server/blob/main/progress/spreadsheet/spreadsheet.xlsx) and the [docs](https://oscarnow.github.io/minecraft-server/). |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

This is a pure JS library that gives you access to an easy to use API that you can use to create Minecraft Java 1.16.3 servers. This package has types built in. You have full control over the packets that are being sent to the Clients in an easy to use way. This means you can send different information to each Client, so that for example, for one Client it is raining and for a different one it's not.

## **Installation and usage**
1. Install with `npm i @boem312/minecraft-server`.
2. Now you can use the library. Here's some example code:
```js
const { Server } = require('@boem312/minecraft-server');
const server = new Server();

server.on('connect', client => {

    console.log(`${client.username} joined`);
    client.chat(`Hello world, ${client.username}`);

});

server.on('listening', () => console.log('Listening on localhost:25565'));
```
3. Join the server with Minecraft Java Edition version `1.16.3` on host `localhost` and on port `25565`. Different versions and ports are currently not supported.

For more examples, please see [the examples folder](https://github.com/OscarNOW/minecraft-server/tree/main/examples).

If you want to now how to use the rest of the library, please see [the documentation](https://oscarnow.github.io/minecraft-server/).

If you have any questions please first read the [FAQ](https://github.com/OscarNOW/minecraft-server/blob/main/FAQ.md). If your question isn't in there, you can [ask a question in discussions](https://github.com/OscarNOW/minecraft-server/discussions/new?category=questions).

## Key features

* **Easy to use**, you can create servers in an intuitive way.
* **Everything is per Client**, meaning you can send different information to different Clients.
* **Pure NODE-JS**, this isn't a java server wrapper, the actual Minecraft protocol is implemented in JS.
* **Control**, because only an api for the protocol is implemented, you have much greater control.

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

![Explanation of ISC license](https://github.com/OscarNOW/minecraft-server/blob/main/assets/ISC%20license/github/dark.png?raw=true#gh-dark-mode-only)
![Explanation of ISC license](https://github.com/OscarNOW/minecraft-server/blob/main/assets/ISC%20license/github/light.png?raw=true#gh-light-mode-only)

## **Special thanks**
* [wiki.vg](https://wiki.vg) for documenting the full Minecraft protocol.
* [minecraft-protocol](https://github.com/PrismarineJS/node-minecraft-protocol) for parsing all the packets and helping with the login process.
* [All the contributors](https://github.com/OscarNOW/minecraft-server/graphs/contributors) for helping improve the package.
* [Typedoc](https://typedoc.org/) for generating part of the documentation.
