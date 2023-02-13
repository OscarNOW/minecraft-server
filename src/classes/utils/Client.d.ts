type Horse = import('./Horse').Horse;
type Item = import('./Item').Item;
type LoadedChunk = import('./LoadedChunk').LoadedChunk;
type TabItem = import('./TabItem').TabItem;
type Entity = import('./Entity').Entity;
type EntityLike = import('./Entity').EntityLike;
type EntityConditional<a> = import('./Entity').EntityConditional<a>;
type BossBar = import('./BossBar').BossBar;
type optionalBossBarInfo = import('./BossBar').optionalBossBarInfo;

type Server = import('../exports/Server').Server;
type Chunk = import('../exports/Chunk').Chunk;
type Text = import('../exports/Text').Text;
type textInput = import('../exports/Text').textInput;

type changeEventType =
    'entities' |
    'chunks' |
    'bossBars' |
    'tabItems' |
    'slot' |
    'health' |
    'food' |
    'foodSaturation' |
    'toxicRainLevel' |
    'raining' |
    'showRespawnScreen' |
    'sneaking' |
    'sprinting' |
    'onGround' |
    'position' |
    'gamemode' |
    'difficulty' |
    'inventory';

type changeEventReturn<changeEventType extends changeEventType> =
    changeEventType extends 'entities' ? entities :
    changeEventType extends 'chunks' ? LoadedChunk[] :
    changeEventType extends 'bossBars' ? bossBar[] :
    changeEventType extends 'tabItems' ? TabItem[] :
    changeEventType extends 'gamemode' ? gamemode :
    changeEventType extends 'difficulty' ? difficulty :
    changeEventType extends 'inventory' ? inventory :
    changeEventType extends 'slot' ? number :
    changeEventType extends 'health' ? number :
    changeEventType extends 'food' ? number :
    changeEventType extends 'foodSaturation' ? number :
    changeEventType extends 'toxicRainLevel' ? number :
    changeEventType extends 'raining' ? boolean :
    changeEventType extends 'showRespawnScreen' ? boolean :
    changeEventType extends 'sneaking' ? boolean :
    changeEventType extends 'sprinting' ? boolean :
    changeEventType extends 'onGround' ? boolean :
    changeEventType extends 'position' ? {
        x: number;
        y: number;
        z: number;
        yaw: number;
        pitch: number;
    } :
    never;

type entities = {
    readonly [entityId: number]: EntityLike;
} & {
    readonly 0: Client
};

type inventory = {
    readonly cursor?: Item;
    readonly armor: {
        readonly helmet?: Item;
        readonly chestplate?: Item;
        readonly leggings?: Item;
        readonly boots?: Item;
    };
    readonly offhand?: Item;
    readonly crafting: {
        readonly output?: Item;
        readonly slots: {
            0?: Item;
            1?: Item;
            2?: Item;
            3?: Item;
        };
    };
    readonly hotbar: {
        0?: Item;
        1?: Item;
        2?: Item;
        3?: Item;
        4?: Item;
        5?: Item;
        6?: Item;
        7?: Item;
        8?: Item;
    };
    readonly slots: {
        readonly [slot: number]: Item | undefined;
    };
};

type state = 'connecting' | 'connected' | 'loginSent' | 'settingsReceived' | 'afterLoginPacketsSent' | 'clientSpawned' | 'brandReceived' | 'offline';

export class Client {
    private constructor(client: unknown, server: Server, earlyInfo: {
        version: newVersion;
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
    readonly version: newVersion;
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

    /* Readonly changing */
    private readonly p: { // todo: make more explicitly typed
        client: unknown;
        defaultClientProperties: (client: Client) => defaultClientProperties;
        changeEvents: {
            [event: string]: ((newValue: unknown, oldValue: unknown) => void)[];
        };
        events: {
            [event: string]: ((...args: unknown[]) => void)[];
        };
        intervals: NodeJS.Timeout[];
        shutdownCallbacks: (() => void)[];
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
        emit: (name: string, ...args: unknown[]) => void;
        emitChange: (type: string, oldValue: unknown) => void;
        emitError: (customError: customError) => void;
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
        bossBars: bossBar[]; // todo: add underscore before name
        _brand: string | null;
        _chatSettings: {
            visible: 'all' | 'commands' | 'none';
            colors: boolean;
        };
        _difficulty: difficulty;
        entities: entities; // todo: add underscore before <Client>.p.entities so that it becomes <Client>.p._entities
        _experience: {
            bar: number;
            level: number;
        };
        _food: number;
        _foodSaturation: 0 | 1 | 2 | 3 | 4 | 5;
        _gamemode: gamemode;
        _health: number;
        _inventory: inventory;
        _locale: unknown; // todo: create locale type
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
        _slot: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
        _sneaking: boolean;
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
            [property: string]: unknown;
        };
        chunksGenerated: boolean;
        _chunks: (LoadedChunk[]) | ((() => LoadedChunk)[]);
    };
    readonly inventory: inventory;

    readonly sneaking: boolean;
    readonly sprinting: boolean;
    readonly onGround: boolean;
    readonly online: boolean;
    readonly ping: number;

    readonly entities: entities;
    readonly bossBars: BossBar[];
    readonly chunks: LoadedChunk[];
    readonly tabItems: TabItem[];

    /* Writable changing */
    position: {
        x: number;
        y: number;
        z: number;
        yaw: number;
        pitch: number;
    };
    experience: {
        bar: number;
        level: number;
    };
    get tabHeader(): Text;
    set tabHeader(text: textInput | Text);
    get tabFooter(): Text;
    set tabFooter(text: textInput | Text);

    raining: boolean;
    toxicRainLevel: number;
    showRespawnScreen: boolean;
    gamemode: gamemode;
    difficulty: difficulty;

    slot: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    health: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
    food: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
    foodSaturation: 0 | 1 | 2 | 3 | 4 | 5;

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
    cooldown(item: itemName, tickAmount?: number): void;
    demo(message: demoMessage): void;
    elderGuardian(): void;
    win(showCredits: boolean): void;
    kick(reason: textInput | Text): void; //todo: rename to remove, for consistency
    chat(message?: textInput | Text): void;
    setBlock(block: blockName, location: {
        x: number;
        y: number;
        z: number;
    }, state?: blockState): this;
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
    entity<name extends defaultArgumentEntityName>(entity: name, position: {
        x: number;
        y: number;
        z: number;
        yaw?: number;
        pitch?: number;
    }): EntityConditional<name>;
    entity(entity: 'player', position: {
        x: number;
        y: number;
        z: number;
        yaw?: number;
        pitch?: number;
    }, playerInfo?: {
        tabItem?: TabItem;
        name?: string;
        uuid?: string;
        gamemode?: gamemode;
    }): Promise<EntityConditional<'player'>>;
    tabItem(tabItemOptions?: {
        name?: textInput | Text;
        uuid?: string;
        ping?: number | null;
    }): Promise<TabItem>;
    window(windowType: nonEntityWindowName): void;
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

    removeAllListeners(event?: 'itemUse' | 'armSwing' | 'misbehavior' | 'chat' | 'signEditorClose' | 'itemHandSwap' | 'connect' | 'join' | 'leave' | 'windowClose' | 'inventoryClose' | 'digStart' | 'digCancel' | 'blockBreak' | 'itemDrop' | 'leftClick' | 'rightClick'): void;

    on<currentChangeEventType extends changeEventType>(event: 'change', type: currentChangeEventType, callback: (newValue: changeEventReturn<currentChangeEventType>, oldValue: changeEventReturn<currentChangeEventType>) => void): void;
    on(event: 'itemUse' | 'armSwing', callback: (isMainHand: boolean) => void): void;
    on(event: 'misbehavior', callback: (customError: CustomError) => void): void;
    on(event: 'chat', callback: (message: string) => void): void;
    on(event: 'signEditorClose', callback: (signText: string[], location: {
        x: number;
        y: number;
        z: number;
    }) => void): void;
    on(event: 'connect' | 'join' | 'brandReceive' | 'leave' | 'windowClose' | 'inventoryClose' | 'leftClick' | 'respawn' | 'itemHandSwap', callback: () => void): void;
    on(event: 'digStart', callback: (location: {
        x: number;
        y: number;
        z: number;
    }, blockFace: blockFace) => void): void;
    on(event: 'digCancel' | 'blockBreak', callback: (location: {
        x: number;
        y: number;
        z: number;
    }) => void): void;
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
    once(event: 'connect' | 'join' | 'brandReceive' | 'leave' | 'windowClose' | 'inventoryClose' | 'leftClick' | 'respawn' | 'itemHandSwap', callback: () => void): void;
    once(event: 'digStart', callback: (location: {
        x: number;
        y: number;
        z: number;
    }, blockFace: blockFace) => void): void;
    once(event: 'digCancel' | 'blockBreak', callback: (location: {
        x: number;
        y: number;
        z: number;
    }) => void): void;
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
    }
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

    slot?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    health?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
    food?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
    foodSaturation?: 0 | 1 | 2 | 3 | 4 | 5;
};