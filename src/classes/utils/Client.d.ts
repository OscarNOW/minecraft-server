import { EventEmitter } from 'events';

type Entity = import('./Entity').Entity;
type Text = import('../exports/Text').Text;
type Server = import('../exports/Server').Server;
type Chunk = import('../exports/Chunk').Chunk;
type Color = import('../exports/Color').Color;

export class Client extends EventEmitter {
    private constructor(client: any, server: Server, earlyInformation: {
        version: newVersion;
        ip: string;
        connection: {
            host: string;
            port: number;
        }
    }, defaultClientProperties?: (client: Client) => {
        experience?: {
            bar?: number;
            level?: number;
        };

        raining?: boolean;
        toxicRainLevel?: number;
        showRespawnScreen?: boolean;
        gamemode?: 'survival' | 'creative' | 'adventure' | 'spectator';
        difficulty?: 'peaceful' | 'easy' | 'normal' | 'hard';

        slot?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
        health?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
        food?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
        foodSaturation?: 0 | 1 | 2 | 3 | 4 | 5;
    });

    /* Constant */
    readonly server: Server;
    readonly username: string;
    readonly uuid: string;
    readonly entityId: number;
    readonly version: newVersion;
    readonly ip: string;
    readonly connection: {
        readonly host: string;
        readonly port: number
    };
    readonly textures: {
        skin: string;
        cape?: string;
    };
    readonly locale: {
        readonly langCode: string;
        readonly englishName: string;
        readonly menuName: string;
        readonly version?: string;
        readonly region?: string;
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
    readonly online: boolean;
    readonly sneaking: boolean;
    readonly onGround: boolean;
    readonly ping: number;
    readonly entities: {
        readonly [entityId: number]: Entity;
    };
    readonly bossBars: {
        title: string;
        health: number;
        color: bossBarColor;
        divisionAmount: bossBarDivision;
        flags: bossBarFlags;
        id: string;
        remove(): void;
    }[];

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

    raining: boolean;
    toxicRainLevel: number;
    showRespawnScreen: boolean;
    gamemode: 'survival' | 'creative' | 'adventure' | 'spectator';
    difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';

    slot: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    health: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
    food: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
    foodSaturation: 0 | 1 | 2 | 3 | 4 | 5;

    observe(type: 'slot' | 'health' | 'food' | 'foodSaturation' | 'toxicRainLevel', callback: (changedValue: number) => void): void;
    observe(type: 'raining' | 'showRespawnScreen' | 'sneaking' | 'onGround', callback: (changedValue: boolean) => void): void;
    observe(type: 'position', callback: (changedValue: {
        x: number;
        y: number;
        z: number;
        yaw: number;
        pitch: number;
    }) => void): void;
    observe(type: 'gamemode', callback: (changedValue: 'survival' | 'creative' | 'adventure' | 'spectator') => void): void;
    observe(type: 'difficulty', callback: (changedValue: 'peaceful' | 'easy' | 'normal' | 'hard') => void): void;

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
    particle(
        particleName: 'block' | 'block_marker' | 'falling_dust',
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
        },
        block: blockType
    ): void;
    particle(
        particleName: 'dust',
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
        },
        color: Color | rgb,
        scale: number
    ): void;
    particle(
        particleName: 'item',
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
        },
        item: itemType,
        itemAmount: number
    ): void;
    particle(
        particleName: 'vibration',
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
        },
        ticks: number,
        origin: {
            x: number;
            y: number;
            z: number;
        },
        destination: Entity | {
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
        destroyedBlocks: Array<{
            xOffset: number;
            yOffset: number;
            zOffset: number;
        }>
    ): void;
    blockBreakAnimation(location: {
        x: number;
        y: number;
        z: number;
    }, stage: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10): void;
    resetCamera(): void;
    cooldown(item: itemType, tickAmount?: number): void;
    demo(message: demoMessage): void;
    elderGuardian(): void;
    win(showCredits: boolean): void;
    kick(reason: string | Text): void;
    chat(message: string | Text): void;
    title(properties: {
        fadeIn?: number;
        stay?: number;
        fadeOut?: number;
        title?: string | Text;
        subTitle?: string | Text;
    } | string | Text): void;
    actionBar(text: string | Text): void;
    chunk(chunk: Chunk, chunkPosition: {
        x: number;
        z: number;
    }): void;
    entity(entityType: entityType, position: {
        x: number;
        y: number;
        z: number;
        yaw: number;
        pitch: number;
    }): Entity;
    window(windowType: windowType): void;
    window(windowType: 'horse', horse: Entity): void;
    bossBar(bossBarInfo: {
        title: string | Text;
        health: number;
        color: bossBarColor;
        divisionAmount: bossBarDivision;
        flags: bossBarFlags;
    }): {
        title: string;
        health: number;
        color: bossBarColor;
        divisionAmount: bossBarDivision;
        flags: bossBarFlags;
    };
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

    on(event: 'chat', callback: (message: string) => void): void;
    on(event: 'leave' | 'itemHandSwap', callback: () => void): void;
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

    once(event: 'chat', callback: (message: string) => void): void;
    once(event: 'leave' | 'itemHandSwap', callback: () => void): void;
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

    addListener(event: 'chat', callback: (message: string) => void): void;
    addListener(event: 'leave' | 'itemHandSwap', callback: () => void): void;
    addListener(event: 'digStart', callback: (location: {
        x: number;
        y: number;
        z: number;
    }, blockFace: blockFace) => void): void;
    addListener(event: 'digCancel' | 'blockBreak', callback: (location: {
        x: number;
        y: number;
        z: number;
    }) => void): void;
    addListener(event: 'itemDrop', callback: (stack: boolean) => void): void;

    prependListener(event: 'chat', callback: (message: string) => void): void;
    prependListener(event: 'leave' | 'itemHandSwap', callback: () => void): void;
    prependListener(event: 'digStart', callback: (location: {
        x: number;
        y: number;
        z: number;
    }, blockFace: blockFace) => void): void;
    prependListener(event: 'digCancel' | 'blockBreak', callback: (location: {
        x: number;
        y: number;
        z: number;
    }) => void): void;
    prependListener(event: 'itemDrop', callback: (stack: boolean) => void): void;

    prependOnceListener(event: 'chat', callback: (message: string) => void): void;
    prependOnceListener(event: 'leave' | 'itemHandSwap', callback: () => void): void;
    prependOnceListener(event: 'digStart', callback: (location: {
        x: number;
        y: number;
        z: number;
    }, blockFace: blockFace) => void): void;
    prependOnceListener(event: 'digCancel' | 'blockBreak', callback: (location: {
        x: number;
        y: number;
        z: number;
    }) => void): void;
    prependOnceListener(event: 'itemDrop', callback: (stack: boolean) => void): void;

    off(event: 'chat', callback: (message: string) => void): void;
    off(event: 'leave' | 'itemHandSwap', callback: () => void): void;
    off(event: 'digStart', callback: (location: {
        x: number;
        y: number;
        z: number;
    }, blockFace: blockFace) => void): void;
    off(event: 'digCancel' | 'blockBreak', callback: (location: {
        x: number;
        y: number;
        z: number;
    }) => void): void;
    off(event: 'itemDrop', callback: (stack: boolean) => void): void;

    removeListener(event: 'chat', callback: (message: string) => void): void;
    removeListener(event: 'leave' | 'itemHandSwap', callback: () => void): void;
    removeListener(event: 'digStart', callback: (location: {
        x: number;
        y: number;
        z: number;
    }, blockFace: blockFace) => void): void;
    removeListener(event: 'digCancel' | 'blockBreak', callback: (location: {
        x: number;
        y: number;
        z: number;
    }) => void): void;
    removeListener(event: 'itemDrop', callback: (stack: boolean) => void): void;

    rawListeners(event: 'chat'): ((message: string) => void)[];
    rawListeners(event: 'leave' | 'itemHandSwap'): (() => void)[];
    rawListeners(event: 'digStart'): ((location: {
        x: number;
        y: number;
        z: number;
    }, blockFace: blockFace) => void)[];
    rawListeners(event: 'digCancel' | 'blockBreak'): ((location: {
        x: number;
        y: number;
        z: number;
    }) => void)[];
    rawListeners(event: 'itemDrop'): ((stack: boolean) => void)[];

    removeAllListeners(event?: 'chat' | 'leave' | 'itemHandSwap' | 'digStart' | 'digCancel' | 'blockBreak' | 'itemDrop'): void;
}

type bossBarColor = 'pink' | 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'white';
type bossBarDivision = 0 | 6 | 10 | 12 | 20;
type bossBarFlags = {
    darkenSky: boolean;
    playEndMusic: boolean;
    createFog: boolean;
};

type windowType = 'anvil' | 'beacon' | 'brewingStand' | 'chest' | 'container' | 'craftingTable' | 'dispenser' | 'dropper' | 'enchanting_table' | 'furnace' | 'hopper' | 'villager' /* | 'horse' */;

type blockFace = `${'+' | '-'}${'X' | 'Y' | 'Z'}`;