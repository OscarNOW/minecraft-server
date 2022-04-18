const Entity = require('./Entity').Entity;
const ChangablePosition = require('./ChangablePosition').ChangablePosition;
const windowNameIdMapping = require('../../data/windowNameIdMapping.json');
const languages = require('../../data/languages.json');
const wait = ms => new Promise(res => setTimeout(res, ms));

class Client {
    constructor(client, server) {
        const that = this;

        this.canUsed = false;
        this.readyStates = {
            socketOpen: false,
            clientSettings: false
        }
        this.joinedPacketSent = false;
        this.leftPacketSent = false;

        this.client = client;
        this.server = server;

        let textures = JSON.parse(Buffer.from(this.client.profile.properties[0].value, 'base64').toString()).textures;
        this.textures = {
            skin: textures.SKIN.url
        };
        if (textures.CAPE)
            this.textures.cape = textures.CAPE.url;

        this.username = this.client.username;
        this.uuid = this.client.uuid;
        this.ping = this.client.latency;
        this._slot = null;
        this._darkSky = false;
        this._gamemode = 'survival';

        this.client.socket.addListener('close', () => {
            this.updateCanUsed();
        })

        this._position = new ChangablePosition(i => that.teleport.call(that, i), {
            x: null,
            y: null,
            z: null,
            yaw: null,
            pitch: null
        })

        this.entities = {};

        this.events = {
            chat: [],
            move: [],
            leave: [],
            slotChange: []
        }

        this.client.on('use_entity', obj => {
            if (!this.entities[obj.target]) throw new Error(`Unknown target "${obj.target}"`)
            // this.sneaking = obj.sneaking;

            if (obj.mouse == 2) {
                if (obj.hand != 0 && obj.hand != 1) throw new Error(`Unknown hand "${obj.hand}"`)
                this.entities[obj.target].events.rightClick.forEach(val => {
                    val(
                        {
                            x: obj.x,
                            y: obj.y,
                            z: obj.z
                        },
                        obj.hand == 0 ? this.mainHand : (this.mainHand == 'left' ? 'right' : 'left')
                    )
                })
            } else if (obj.mouse == 0)
                return
            else if (obj.mouse == 1)
                this.entities[obj.target].events.leftClick.forEach(val => { val() })
            else
                throw new Error(`Unknown mouse "${obj.mouse}"`)
        })

        this.client.on('chat', ({ message }) => {
            this.events.chat.forEach(val => {
                val(message);
            })
        })

        this.client.on('held_item_slot', ({ slotId }) => {
            if (slotId < 0 || slotId > 8)
                throw new Error(`Unknown slotId "${slotId}"`)

            this._slot = slotId + 1;
            this.events.slotChange.forEach(val => val());
        })

        this.client.on('position', i => this.emitMove.call(this, i));
        this.client.on('position_look', i => this.emitMove.call(this, i));
        this.client.on('look', i => this.emitMove.call(this, i));
        this.client.on('flying', i => this.emitMove.call(this, i));

        this.client.on('settings', ({ locale, viewDistance, chatFlags, chatColors, skinParts, mainHand }) => {
            let langCode = locale.toLowerCase();
            if (!languages[langCode]) throw new Error(`Unknown language code "${langCode}"`)
            let obj = languages[langCode];
            obj.langCode = langCode;

            this.locale = obj;
            this.viewDistance = viewDistance;

            if (chatFlags === 0)
                this.chatSettings = {
                    visible: 'all',
                    colors: chatColors
                };
            else if (chatFlags === 1)
                this.chatSettings = {
                    visible: 'commands',
                    colors: chatColors
                };
            else if (chatFlags === 2)
                this.chatSettings = {
                    visible: 'none',
                    colors: chatColors
                };
            else
                throw new Error(`Unknown chatFlags "${chatFlags}"`)

            let bsp = Number(skinParts).toString(2).padStart(7, '0').split('').map(bit => Number(bit) === 1);
            this.visibleSkinParts = {
                cape: bsp[6],
                torso: bsp[5],
                leftArm: bsp[4],
                rightArm: bsp[3],
                leftLeg: bsp[2],
                rightLeg: bsp[1],
                hat: bsp[0]
            }

            if (mainHand === 0)
                this.mainHand = 'left'
            else if (mainHand === 1)
                this.mainHand = 'right'
            else
                throw new Error(`Unknown mainHand "${mainHand}"`)

            this.readyStates.clientSettings = true;
            this.updateCanUsed();
        })

    }

    updateCanUsed() {
        this.readyStates.socketOpen = this.online;
        let canUsed = true;
        for (const val of Object.values(this.readyStates))
            if (!val) canUsed = false;

        this.canUsed = canUsed;
        if (this.canUsed && !this.joinedPacketSent && !this.leftPacketSent) {
            this.joinedPacketSent = true;

            this.server.clients.push(this);
            this.server.events.join.forEach(val => val(this));

        } else if (!canUsed && !this.leftPacketSent && this.joinedPacketSent) {
            this.leftPacketSent = true;

            this.server.clients = this.server.clients.filter(client => client.canUsed);
            this.events.leave.forEach(val => {
                val();
            });
            this.server.events.leave.forEach(val => {
                val(this);
            });
        }
    }

    get online() {
        return this.client.socket.readyState == 'open';
    }

    get position() {
        return this._position;
    }

    set position(val) {
        this.teleport(val);
    }

    get slot() {
        return this._slot;
    }

    set slot(slot) {
        if (slot < 0 || slot > 8)
            throw new Error(`Unknown slot "${slot}"`)

        this.client.write('held_item_slot', {
            slot: slot
        })
    }

    get darkSky() {
        return this._darkSky;
    }

    set darkSky(darkSky) {
        if (darkSky != false && darkSky != true)
            throw new Error(`darkSky has to be true or false. Received "${darkSky}"`)

        this._darkSky = darkSky;

        this.client.write('game_state_change', {
            reason: darkSky ? 2 : 1
        })
    }

    get gamemode() {
        return this._gamemode;
    }

    set gamemode(gamemode) {
        if (!['survival', 'creative', 'adventure', 'spectator'].includes(gamemode))
            throw new Error(`Unknown gamemode "${gamemode}"`)

        this._gamemode = gamemode;

        this.client.write('game_state_change', {
            reason: 3,
            gameMode: ['survival', 'creative', 'adventure', 'spectator'].indexOf(gamemode)
        })
    }

    demo(message) {
        let messages = {
            startScreen: 0,
            movement: 101,
            jump: 102,
            inventory: 103,
            endScreenshot: 104
        };

        if (messages[message] === undefined)
            throw new Error(`Unknown message "${message}"`)

        this.client.write('game_state_change', {
            reason: 5,
            gameMode: messages[message]
        })
    }

    elderGuardian() {
        this.client.write('game_state_change', {
            reason: 10
        })
    }

    win(hideCredits) {
        if (hideCredits)
            throw new Error('Not implemented')

        this.client.write('game_state_change', {
            reason: 4,
            gameMode: hideCredits ? 0 : 1
        })
    }

    emitMove(info) {
        if (!this.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to recieve this packet.' : 'This is because the Client is no longer online'}`)

        let changed = false;
        [
            'x',
            'y',
            'z',
            'pitch',
            'yaw'
        ].forEach(val => {
            if (info[val] !== undefined && this._position[val] != info[val]) {
                changed = true;
                this._position.raw[val] = info[val];
            }
        });

        if (changed)
            this.events.move.forEach(val => {
                val();
            })
    }

    on(event, callback) {
        if (!this.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to recieve this packet.' : 'This is because the Client is no longer online'}`)

        if (!this.events[event]) throw new Error(`Unknown event "${event}"`)
        this.events[event].push(callback);
    }

    kick(reason) {
        if (!this.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to recieve this packet.' : 'This is because the Client is no longer online'}`)

        this.client.end(`${reason}`);
    }

    chat(message) {
        if (!this.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to recieve this packet.' : 'This is because the Client is no longer online'}`)

        this.client.write('chat', {
            message: JSON.stringify({ translate: `${message}` }),
            position: 0,
            sender: '0'
        });
    }

    title(properties) {
        let { fadeIn, stay, fadeOut, title, subTitle } = properties || {};

        this.client.write('title', {
            action: 5
        })

        this.client.write('title', {
            action: 3,
            fadeIn: fadeIn ?? 10,
            stay: stay ?? 40,
            fadeOut: fadeOut ?? 10
        })

        this.client.write('title', {
            action: 0,
            text: JSON.stringify({ translate: `${(title && title !== '') ? title : ''}` })
        })
        if (subTitle && subTitle !== '')
            this.client.write('title', {
                action: 1,
                text: JSON.stringify({ translate: `${subTitle}` })
            })
    }

    actionBar(text) {
        this.client.write('title', {
            action: 2,
            text: JSON.stringify({ translate: `${text}` })
        })
    }

    chunk(chunk, { x, z }) {
        if (!this.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to recieve this packet.' : 'This is because the Client is no longer online'}`)

        this.client.write('map_chunk', {
            x,
            z,
            groundUp: true,
            biomes: chunk.chunk.dumpBiomes !== undefined ? chunk.chunk.dumpBiomes() : undefined,
            heightmaps: {
                type: 'compound',
                name: '',
                value: {}
            },
            bitMap: chunk.chunk.getMask(),
            chunkData: chunk.chunk.dump(),
            blockEntities: []
        })
    }

    teleport({ x, y, z, yaw, pitch }) {
        if (!this.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to recieve this packet.' : 'This is because the Client is no longer online'}`)

        this.client.write('position', {
            x,
            y,
            z,
            yaw,
            pitch,
            flags: 0x00
        });
    }

    entity(type, { x, y, z, yaw, pitch }) {
        if (!this.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to recieve this packet.' : 'This is because the Client is no longer online'}`)

        let entityId = null;
        for (let ii = 1; entityId === null; ii++)
            if (!this.entities[ii])
                entityId = ii;

        let entity = new Entity(this, type, entityId, { x, y, z, yaw, pitch });

        this.entities[entityId] = entity;
        return entity;
    }

    difficulty(difficulty) {
        if (!this.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to recieve this packet.' : 'This is because the Client is no longer online'}`)

        if (!['peaceful', 'easy', 'normal', 'hard'].includes(difficulty))
            throw new Error(`Unknown difficulty "${difficulty}"`)

        this.client.write('difficulty', {
            difficulty: ['peaceful', 'easy', 'normal', 'hard'].findIndex(x => x == difficulty),
            difficultyLocked: true
        })
    }

    window(windowType, horse) {
        if (!this.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to recieve this packet.' : 'This is because the Client is no longer online'}`)

        if (!windowNameIdMapping[windowType]) throw new Error(`Unknown windowType "${windowType}"`)
        if (windowType == 'horse' && !horse) throw new Error(`No horse given`)

        let windowId = windowNameIdMapping[windowType];

        if (windowId == 'EntityHorse')
            this.client.write('open_horse_window', {
                windowId: 1,
                nbSlots: 2,
                entityId: horse.id
            })
        else
            throw new Error(`Not implemented`)
    }

    player() {
        throw new Error(`Not implemented`)
        if (!this.canUsed)
            throw new Error(`This action can't be performed on this Client right now. ${this.online ? 'This may be because the Client is no longer online or that the client is not ready to recieve this packet.' : 'This is because the Client is no longer online'}`)

        /*httpRequest({
            host: 'sessionserver.mojang.com',
            method: 'GET',
            path: `/session/minecraft/profile/${this.uuid}?unsigned=false`
        }).then(inf => {
            console.log(inf.properties)*/
        this.client.write('player_info', {
            action: 0,
            data: [
                {
                    UUID: this.uuid,
                    name: this.username,
                    // properties: inf.properties,
                    properties: [],
                    gamemode: 0,
                    ping: this.ping,
                    displayName: this.username
                }
            ]
        })
        // })
    }
}

module.exports = { Client }