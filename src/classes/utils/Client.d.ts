type Horse = import('./Horse').Horse;
type Slot = import('./Slot').Slot;
type LoadedChunk = import('./LoadedChunk').LoadedChunk;
type TabItem = import('./TabItem').TabItem;
type Entity = import('./Entity').Entity;
type EntityLike = import('./Entity').EntityLike;
type BossBar = import('./BossBar').BossBar;
type WorldBorder = import('./WorldBorder').WorldBorder;
type Block<a extends blockName> = import('./Block').Block<a>;
type CustomError = import('./CustomError').CustomError;
type Player = import('./Player').Player;

type EntityConditional<a> = import('./Entity').EntityConditional<a>;
type optionalBossBarInfo = import('./BossBar').optionalBossBarInfo;

type Server = import('../exports/Server').Server;
type Chunk = import('../exports/Chunk').Chunk;
type Text = import('../exports/Text').Text;

type textInput = import('../exports/Text').textInput;

type gamemode = import('../../types').gamemode;
type difficulty = import('../../types').difficulty;
type newVersion = import('../../types').newVersion;
type langCode = import('../../types').langCode;
type langEnglishName = import('../../types').langEnglishName;
type langMenuName = import('../../types').langMenuName;
type langVersion = import('../../types').langVersion;
type langRegion = import('../../types').langRegion;
type noDataParticle = import('../../types').noDataParticle;
type itemName = import('../../types').itemName;
type demoMessage = import('../../types').demoMessage;
type blockName = import('../../types').blockName;
type blockState<a extends blockName> = import('../../types').blockState<a>;
type defaultArgumentEntityName = import('../../types').defaultArgumentEntityName;
type nonEntityWindowName = import('../../types').nonEntityWindowName;
type soundName = import('../../types').soundName;
type soundChannel = import('../../types').soundChannel;
type blockFace = import('../../types').blockFace;
type customStatisticName = import('../../types').customStatisticName;
type entityName = import('../../types').entityName;

type experience = {
    bar: number;
    level: number;
};

type statistic = (
    {
        category: 'mined';
        statistic: blockName;
        value: number;
    } |
    {
        category: 'crafted' | 'used' | 'broken' | 'pickedUp' | 'dropped';
        statistic: itemName;
        value: number;
    } |
    {
        category: 'killed' | 'killedBy';
        statistic: entityName;
        value: number;
    } |
    {
        category: 'custom';
        statistic: customStatisticName;
        value: number;
    }
);
type statistics = statistic[];

type blocksSegment = {
    [x: number]: {
        [y: number]: {
            [z: number]: Block<blockName>;
        };
    };
};

// if this is changed, make sure to also change in changeEvent.js
type changeEventType =
    'blocks' |
    'bossBars' |
    'chunks' |
    'difficulty' |
    'entities' |
    'food' |
    'foodSaturation' |
    'gamemode' |
    'health' |
    'inventory' |
    'onGround' |
    'position' |
    'raining' |
    'showRespawnScreen' |
    'slot' |
    'sneaking' |
    'sprinting' |
    'statistics' |
    'tabFooter' |
    'tabHeader' |
    'tabItems' |
    'toxicRainLevel';

type changeEventReturn<currentChangeEventType extends changeEventType> =
    currentChangeEventType extends 'blocks' ? blocksSegment :
    currentChangeEventType extends 'bossBars' ? BossBar[] :
    currentChangeEventType extends 'chunks' ? LoadedChunk[] :
    currentChangeEventType extends 'difficulty' ? difficulty :
    currentChangeEventType extends 'entities' ? entities :
    currentChangeEventType extends 'experience' ? experience :
    currentChangeEventType extends 'food' ? number :
    currentChangeEventType extends 'foodSaturation' ? number :
    currentChangeEventType extends 'gamemode' ? gamemode :
    currentChangeEventType extends 'health' ? number :
    currentChangeEventType extends 'inventory' ? inventory :
    currentChangeEventType extends 'onGround' ? boolean :
    currentChangeEventType extends 'position' ? {
        x: number;
        y: number;
        z: number;
        yaw: number;
        pitch: number;
    } :
    currentChangeEventType extends 'raining' ? boolean :
    currentChangeEventType extends 'showRespawnScreen' ? boolean :
    currentChangeEventType extends 'slot' ? number :
    currentChangeEventType extends 'sneaking' ? boolean :
    currentChangeEventType extends 'sprinting' ? boolean :
    currentChangeEventType extends 'statistics' ? statistics :
    currentChangeEventType extends 'tabFooter' ? Text :
    currentChangeEventType extends 'tabHeader' ? Text :
    currentChangeEventType extends 'tabItems' ? TabItem[] :
    currentChangeEventType extends 'toxicRainLevel' ? number :
    never;

type entities = {
    readonly [entityId: number]: EntityLike;
} & {
    readonly 0: Client;
};

type inventory = {
    readonly cursor?: Slot;
    readonly armor: {
        readonly helmet?: Slot;
        readonly chestplate?: Slot;
        readonly leggings?: Slot;
        readonly boots?: Slot;
    };
    readonly offhand?: Slot;
    readonly crafting: {
        readonly output?: Slot;
        readonly slots: {
            0?: Slot;
            1?: Slot;
            2?: Slot;
            3?: Slot;
        };
    };
    readonly hotbar: {
        0?: Slot;
        1?: Slot;
        2?: Slot;
        3?: Slot;
        4?: Slot;
        5?: Slot;
        6?: Slot;
        7?: Slot;
        8?: Slot;
    };
    readonly slots: {
        readonly [slot: number]: Slot | undefined;
    };
};

type state = 'connecting' | 'connected' | 'loginSent' | 'settingsReceived' | 'afterLoginPacketsSent' | 'clientSpawned' | 'brandReceived' | 'offline';

/**
 * @see https://oscarnow.github.io/minecraft-server/{version}/classes/Client
 */
export class Client {
    /**
     * @package
     */
    constructor(client: unknown, server: Server, earlyInfo: {
        version: newVersion; //todo: change to protocolVersion
        ip: string;
        connection: {
            host: string;
            port: number;
        }
    }, defaultClientProperties?: (client: Client) => defaultClientProperties);

    /* Readonly constant */
    readonly server: Server;
    readonly username: string;
    readonly uuid: string;
    readonly entityId: number;
    readonly version: newVersion; //todo: change to protocolVersions
    readonly ip: string;
    readonly brand: string | null;
    readonly connection: {
        readonly host: string;
        readonly port: number
    };
    readonly textures: {
        readonly skin: string;
        readonly cape?: string;
    };
    readonly locale: {
        readonly langCode: langCode;
        readonly englishName: langEnglishName;
        readonly menuName: langMenuName;
        readonly serious: boolean;

        readonly version?: langVersion;
        readonly region?: langRegion;
    };
    readonly chatSettings: {
        readonly visible: 'all' | 'commands' | 'none';
        readonly colors: boolean;
    };
    readonly visibleSkinParts: {
        readonly cape: boolean;
        readonly torso: boolean;
        readonly leftArm: boolean;
        readonly rightArm: boolean;
        readonly leftLeg: boolean;
        readonly rightLeg: boolean;
        readonly hat: boolean;
    };
    readonly rightHanded: boolean;
    readonly viewDistance: number;
    readonly reducedDebugInfo: boolean;
    readonly skinAccountUuid: string | null;

    /* Readonly changing */
    /**
     * @package
     */
    readonly p: {
        client: unknown;
        defaultClientProperties: (client: Client) => defaultClientProperties;
        changeEvents: {
            [currentChangeEventType in changeEventType]: ((newValue: changeEventReturn<currentChangeEventType>, oldValue: changeEventReturn<currentChangeEventType>) => void)[];
        };
        events: {
            [event: string]: ((...args: unknown[]) => void)[]; //todo?
        };
        intervals: NodeJS.Timeout[];
        state: state;
        stateHandler: {
            checkReady: () => boolean;
            init: () => void;
            handleNewState: (currentState: state) => void;
            updateState: {
                set: (stateName: state) => void;
                close: () => void;
                packetReceived: (packetName: string) => void;
            };
        };
        timeouts: NodeJS.Timeout[];
        changeEventHasListeners: (changeEvent: string) => boolean;
        clientOn: (name: string, callback: (...args: unknown[]) => void) => void;
        emit: (name: string, ...args: unknown[]) => void; //todo?
        emitChange: <currentChangeEventType extends changeEventType>(type: currentChangeEventType, oldValue: changeEventReturn<currentChangeEventType>) => void;
        emitError: (customError: CustomError) => void;
        emitMove: (info: {
            x: number;
            y: number;
            z: number;
            yaw: number;
            pitch: number;
        }) => void;
        receivePacket: (name: string, packet: object) => void;
        sendAfterLoginPackets: () => void;
        sendLoginPacket: () => void;
        sendPacket: (name: string, packet: object) => void;
        setInterval: (callback: () => void, time: number) => void;
        setTimeout: (callback: () => void, delay: number) => void;
        shutdown: () => void;
        bossBars: BossBar[]; // todo: add underscore before name
        _brand: string | null;
        _chatSettings: {
            visible: 'all' | 'commands' | 'none';
            colors: boolean;
        };
        _difficulty: difficulty;
        entities: entities; // todo: add underscore before <Client>.p.entities so that it becomes <Client>.p._entities
        _experience: experience;
        _food: number;
        _foodSaturation: 0 | 1 | 2 | 3 | 4 | 5;
        _gamemode: gamemode;
        _health: number;
        _inventory: inventory;
        _locale: {
            langCode: langCode;
            englishName: langEnglishName;
            menuName: langMenuName;
            serious: boolean;

            version?: langVersion;
            region?: langRegion;
        };
        onGround: boolean;
        positionSet: boolean;
        _position: {
            x: number;
            y: number;
            z: number;
            yaw: number;
            pitch: number;
        };
        oldPositions: { // todo: rename <Client>.p.oldPositions to <Client>.p.lastPosition
            x: number;
            y: number;
            z: number;
            yaw: number;
            pitch: number;
            isFirst: boolean;
        };
        _raining: boolean;
        _reducedDebugInfo: boolean;
        _rightHanded: boolean;
        _showRespawnScreen: boolean;
        _skinAccountUuid: string | null;
        _slot: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
        _sneaking: boolean;
        _statistics: statistics;
        clientStatistics: statistics;
        _sprinting: boolean;
        _tabFooter: Text;
        _tabHeader: Text;
        _tabItems: TabItem[];
        _toxicRainLevel: number;
        _viewDistance: number;
        _visibleSkinParts: {
            cape: boolean;
            torso: boolean;
            leftArm: boolean;
            rightArm: boolean;
            leftLeg: boolean;
            rightLeg: boolean;
            hat: boolean;
        };
        pubDynProperties: {
            [property: string]: {
                info?: {
                    preventSet?: boolean;
                    defaultable?: false;
                    defaultSetTime?: 'afterLogin' | 'loginPacket';
                    loginPacket: {
                        name: string;
                        minecraftName: string;
                    }[];
                };
                get?: () => unknown;
                set?: (newValue: unknown, beforeReady?: boolean, loginPacket?: boolean) => void | { [minecraftName: string]: unknown };
                init?: () => void;
                [otherProperty: string | symbol]: unknown;
            }
        };
        mpEvents: {
            [event: string]: ((...args: unknown[]) => void)[]; // todo: make more explicit
        };
        defaultProperties: {
            [property: string]: unknown; //todo
        };
        chunksGenerated: boolean;
        blocksGenerated: boolean;
        _chunks: (LoadedChunk[]) | ((() => LoadedChunk)[]);
        _blocks: (blocksSegment) | ((() => blocksSegment)[]);
        //todo: check if there are new properties
    };

    readonly worldBorder: WorldBorder;
    readonly inventory: inventory;

    readonly sneaking: boolean;
    readonly sprinting: boolean;
    readonly onGround: boolean;
    readonly online: boolean;
    readonly ping: number;

    readonly entities: entities;
    /**
     * The blocks in the world, not relative to a chunk.
     */
    readonly blocks: blocksSegment;
    readonly bossBars: BossBar[];
    readonly chunks: LoadedChunk[];
    readonly tabItems: TabItem[];

    /* Writable changing */
    get tabHeader(): Text;
    get tabFooter(): Text;
    get experience(): experience;
    get position(): {
        x: number;
        y: number;
        z: number;
        yaw: number;
        pitch: number;
    };

    set tabHeader(text: textInput | Text);
    set tabFooter(text: textInput | Text);
    set experience(experience: Partial<experience>);
    set position(position: Partial<{
        x: number;
        y: number;
        z: number;
        yaw: number;
        pitch: number;
    }>);

    raining: boolean;
    toxicRainLevel: number;
    showRespawnScreen: boolean;
    gamemode: gamemode;
    difficulty: difficulty;

    slot: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    health: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
    food: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
    foodSaturation: 0 | 1 | 2 | 3 | 4 | 5;

    statistics: statistics;

    // methods

    particle(
        particleName: noDataParticle,
        visibleFromFar: boolean,
        particleAmount: number,
        position: {
            x: number;
            y: number;
            z: number;
        },
        spread: {
            x: number;
            y: number;
            z: number;
        }
    ): void;
    explosion(
        location: {
            x: number;
            y: number;
            z: number;
        }, playerVelocity: {
            x: number;
            y: number;
            z: number;
        }, strength: number,
        destroyedBlocks: {
            xOffset: number;
            yOffset: number;
            zOffset: number;
        }[]
    ): void;
    blockBreakAnimation(location: {
        x: number;
        y: number;
        z: number;
    }, stage: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10): void;
    resetCamera(): void;
    cooldown(item: itemName, seconds?: number): void;
    demo(message: demoMessage): void;
    elderGuardian(): void;
    win(showCredits: boolean): void;
    kick(reason: textInput | Text): void; //todo: rename to remove, for consistency
    chat(message?: textInput | Text): void;
    /**
     * Crashes the Minecraft client instance
     */
    crash(): void;
    /**
     * @param location The absolute location of the block, not relative to a chunk.
     */
    setBlock<currentBlockName extends blockName>(
        blockName: currentBlockName,
        location: { //todo: add overwrite where you can pass a Block class
            x: number;
            y: number;
            z: number;
        },
        blockState: blockState<currentBlockName>
    ): this;
    /**
     * Set a block without sending a packet to the client.
     * @param location The absolute location of the block, not relative to a chunk.
     */
    updateBlock<currentBlockName extends blockName>(
        blockName: currentBlockName,
        location: {
            x: number;
            y: number;
            z: number;
        },
        blockState: blockState<currentBlockName>
    ): this;
    title(properties: {
        fadeIn?: number;
        stay?: number;
        fadeOut?: number;
        title?: textInput | Text;
        subTitle?: textInput | Text;
    } | textInput | Text): void;
    actionBar(text?: textInput | Text): void;
    chunk(chunk: Chunk, chunkPosition: {
        x: number;
        z: number;
    }): void;
    entity<name extends defaultArgumentEntityName | 'experience_orb' | 'player'>(
        entity: name,
        position: {
            x: number;
            y: number;
            z: number;
            yaw?: number;
            pitch?: number;
        },
        extraInfo:
            name extends 'experience_orb' ? {
                experience?: number;
            } :
            name extends 'player' ? {
                tabItem?: TabItem;
                uuid?: string;
                skinAccountUuid?: string;
                name?: string;
                gamemode?: gamemode;
            } :
            never
    ): name extends 'player' ? Promise<EntityConditional<name>> : EntityConditional<name>;
    tabItem(tabItemOptions?: {
        player?: Player;
        name?: textInput | Text;
        uuid?: string;
        skinAccountUuid?: string;
        ping?: number | null;
    }): Promise<TabItem>;
    closeWindow(): void;
    signEditor(signLocation: {
        x: number;
        y: number;
        z: number;
    }): void;
    bossBar(bossBarInfo?: optionalBossBarInfo): BossBar;
    sound(soundInfo: {
        sound: soundName;
        channel: soundChannel;
        position: {
            x: number;
            y: number;
            z: number;
        };
        volume: number;
        pitch: number;
    }): void;
    customSound(soundInfo: {
        sound: string;
        channel: soundChannel;
        position: {
            x: number;
            y: number;
            z: number;
        };
        volume: number;
        pitch: number;
    }): void;
    stopSounds(filter: {
        soundName: soundName | string;
    }): void;
    stopSounds(filter: {
        channel: soundChannel;
    }): void;
    stopSounds(filter: {
        soundName: soundName | string;
        channel: soundChannel;
    }): void;
    pufferFishSound(): void;
    noRespawnBlock(): void;
    playerArrowHitSound(): void;
    kill(deathMessage?: textInput | Text): void;
    acknowledgeDigStart<currentBlockName extends blockName>(
        location: {
            x: number;
            y: number;
            z: number;
        },
        successful: boolean,
        blockName: currentBlockName,
        blockState: blockState<currentBlockName>
    ): void;
    acknowledgeDigCancel<currentBlockName extends blockName>(
        location: {
            x: number;
            y: number;
            z: number;
        },
        successful: boolean,
        blockName: currentBlockName,
        blockState: blockState<currentBlockName>
    ): void;
    acknowledgeBlockBreak<currentBlockName extends blockName>(
        location: {
            x: number;
            y: number;
            z: number;
        },
        successful: boolean,
        blockName: currentBlockName,
        blockState: blockState<currentBlockName>
    ): void;

    removeAllListeners(event?: 'itemUse' | 'armSwing' | 'misbehavior' | 'chat' | 'signEditorClose' | 'itemHandSwap' | 'connect' | 'join' | 'leave' | 'windowClose' | 'inventoryClose' | 'digStart' | 'digCancel' | 'blockBreak' | 'itemDrop' | 'leftClick' | 'rightClick'): void;

    /**
     * @example
     *          client.on('change', 'slot', slot => {
     *              console.log(`${client.username} switched slot to ${slot}`)
     *          });
     *
     */
    on<currentChangeEventType extends changeEventType>(event: 'change', type: currentChangeEventType, callback: (newValue: changeEventReturn<currentChangeEventType>, oldValue: changeEventReturn<currentChangeEventType>) => void): void;
    on(event: 'itemUse' | 'armSwing', callback: (isMainHand: boolean) => void): void;
    on(event: 'misbehavior', callback: (customError: CustomError) => void): void;
    on(event: 'chat', callback: (message: string) => void): void;
    on(event: 'signEditorClose', callback: (signText: string[], location: {
        x: number;
        y: number;
        z: number;
    }) => void): void;
    on(
        event:
            'brandReceive' |
            'connect' |
            'inventoryClose' |
            'itemHandSwap' |
            'join' |
            'leave' |
            'leftClick' |
            'respawn' |
            'statisticsOpen' |
            'windowClose',
        callback: () => void
    ): void;
    on(event: 'digStart', callback: (location: {
        x: number;
        y: number;
        z: number;
    }, blockFace: blockFace) => void): void;
    on(event: 'digCancel', callback: (location: {
        x: number;
        y: number;
        z: number;
    }) => void): void;
    on(event: 'blockBreak', callback: (location: {
        x: number;
        y: number;
        z: number;
    }, previousBlock: Block<blockName>) => void): void;
    on(event: 'itemDrop', callback: (stack: boolean) => void): void;
    on(event: 'rightClick', callback: (clickInfo: {
        position: {
            x: number;
            y: number;
            z: number;
        };
        isMainHand: boolean
    }) => void): void;
    on(event: 'blockPlace', callback: (placeInfo: {
        clickedLocation: {
            x: number;
            y: number;
            z: number;
        };
        clickedFace: blockFace;

        isMainHand: boolean;
        headInsideBlock: boolean;
    }) => void): void;

    once<currentChangeEventType extends changeEventType>(event: 'change', type: currentChangeEventType, callback: (newValue: changeEventReturn<currentChangeEventType>, oldValue: changeEventReturn<currentChangeEventType>) => void): void;
    once(event: 'itemUse' | 'armSwing', callback: (isMainHand: boolean) => void): void;
    once(event: 'misbehavior', callback: (customError: CustomError) => void): void;
    once(event: 'chat', callback: (message: string) => void): void;
    once(event: 'signEditorClose', callback: (signText: string[], location: {
        x: number;
        y: number;
        z: number;
    }) => void): void;
    once(
        event:
            'brandReceive' |
            'connect' |
            'inventoryClose' |
            'itemHandSwap' |
            'join' |
            'leave' |
            'leftClick' |
            'respawn' |
            'statisticsOpen' |
            'windowClose',
        callback: () => void
    ): void;
    once(event: 'digStart', callback: (location: {
        x: number;
        y: number;
        z: number;
    }, blockFace: blockFace) => void): void;
    once(event: 'digCancel', callback: (location: {
        x: number;
        y: number;
        z: number;
    }) => void): void;
    once(event: 'blockBreak', callback: (location: {
        x: number;
        y: number;
        z: number;
    }, previousBlock: Block<blockName>) => void): void;
    once(event: 'itemDrop', callback: (stack: boolean) => void): void;
    once(event: 'rightClick', callback: (clickInfo: {
        position: {
            x: number;
            y: number;
            z: number;
        };
        isMainHand: boolean
    }) => void): void;
    once(event: 'blockPlace', callback: (placeInfo: {
        clickedLocation: {
            x: number;
            y: number;
            z: number;
        };
        clickedFace: blockFace;

        isMainHand: boolean;
        headInsideBlock: boolean;
    }) => void): void;
}

type defaultClientProperties = {
    position?: {
        x?: number;
        y?: number;
        z?: number;
        yaw?: number;
        pitch?: number;
    };
    experience?: {
        bar?: number;
        level?: number;
    };
    tabHeader?: textInput | Text;
    tabFooter?: textInput | Text;

    raining?: boolean;
    toxicRainLevel?: number;
    showRespawnScreen?: boolean;
    gamemode?: gamemode;
    difficulty?: difficulty;
    skinAccountUuid?: string;

    slot?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    health?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
    food?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
    foodSaturation?: 0 | 1 | 2 | 3 | 4 | 5;
};