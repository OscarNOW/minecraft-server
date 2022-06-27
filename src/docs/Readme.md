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

| ⚠ WARNING: Unfortunately, the only current supported Minecraft version is `1.16.3` |
| ------------------------------------------------------------------------------------------ |

An object oriented library that helps you create Minecraft servers.

This is a library that gives you access to an easy to use API that you can use to create Minecraft Java Edition servers. This library includes types. You have full control over the protocol and everything that is being sent to the client in an easy way. This means you can customize everything, and that it's very easy to have different clients see completely different things. However, when you have full control over everything that's being sent to the client, it's more difficult to make a vanilla Minecraft server, because you have to create all the server-side logic yourself.

## **Installation and usage**
1. Install with npm by running `npm i minecraft-server`
1. Example code:
```js
const { Server } = require('minecraft-server');
const server = new Server()

server.on('join', client => {

    client.position = {
        x: 0,
        y: 120,
        z: 0
    };

    client.chat(`Welcome to the server, ${client.username}!`)

    client.on('chat', message => console.log(`<${client.username}> ${message}`))

});
```

For more examples, please see [the examples folder](https://github.com/OscarNOW/minecraft-server/tree/main/examples) for general examples and [the documentation](https://oscarnow.github.io/minecraft-server/) for specific examples.

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

![ISC license](/minecraft-server/assets/ISC%20license_docs.png)



;Server|constructors|constructor|0
```js
const { Server } = require('minecraft-server');
const server = new Server()

server.on('join', client => {

    client.position = {
        x: 0,
        y: 0,
        z: 0
    };

    client.chat(`Welcome to the server, ${client.username}!`)

    console.log(`${client.username} joined`)
    client.on('chat', message => console.log(`<${client.username}> ${message}`))

});
```
:Server|constructors|constructor|1
```js
const { Server, Text } = require('minecraft-server');
const server = new Server({

    serverList: ({ ip, connection: { host, port }, version }) => ({

        description: new Text([
            { text: `Connected through: `, color: 'gray' },
            { text: `${host}:${port}`, color: 'white', modifiers: ['bold'] },
            { text: `\nYour ip: `, color: 'gray' },
            { text: ip, color: 'white', modifiers: ['bold'] }
        ]),

        players: {
            online: server.playerCount,
            max: Math.floor(Math.random() * 100) + 5,
            hover: `More\nthan\n1\nline!`
        },

        version: {
            wrongText: 'Wrong version!',

            /*  Tell client that the correct version is their version, so they 
                always think they have the correct version. Client version is null
                when the version of the client is unknown                           */
            correct: version == null ? '1.16.3' : version
        }

    })

})
```
:Server|constructors|constructor|2
```js

const { Server } = require('./')
const server = new Server({

    serverList: ({ ip, connection: { host, port }, version, legacy }) => ({
        description: `Hi there!\n${ legacy? "You've sent a legacy ping": "You've sent a normal ping" }`,
        players: {
            online: server.playerCount,
            max: 100,
            hover: [ip, `${ host }: ${ port }`, version].join('\n')
        },
        version: {
            wrongText: 'Please use version 1.16.3',
            correct: '1.16.3'
        }
    }),

    wrongVersionConnect: ({ ip, connection: { host, port }, version, legacy }) =>
        `You've connected with the wrong version!\nYour version: ${version}\nCorrect version: 1.16.3`,

    defaultClientProperties: client => ({
        clearSky: true,
        difficulty: client.username == 'notch' ? 'hard' : 'normal',
        food: 20,
        foodSaturation: 5,
        gamemode: 'survival',
        health: 20,
        reducedDebugInfo: false,
        showRespawnScreen: true,
        slot: 0
    })

})

```
:Changable|constructors|constructor|0
```js

function onChange(value) {
    console.log('onChange called', value)
}

const changable = new Changable(onChange, { a: 1, b: 2 });

changable.a = 5; // onChange called { a: 5, b: 2 }

changable.b = 7; // onChange called { a: 5, b: 7 }

console.log(changable.a); // 5


```