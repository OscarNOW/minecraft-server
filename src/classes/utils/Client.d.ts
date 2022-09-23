type Entity = import('./Entity').Entity;
type Horse = import('./Horse').Horse;
type Text = import('../exports/Text').Text;
type Server = import('../exports/Server').Server;
type Chunk = import('../exports/Chunk').Chunk;
type Color = import('../exports/Color').Color;

export class Client {
    private constructor(client: any, server: Server, earlyInformation: {
        version: newVersion;
        ip: string;
        connection: {
            host: string;
            port: number;
        }
    }, defaultClientProperties?: (client: Client) => defaultClientProperties);

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
        readonly [entityId: number]: EntityLike;
        readonly 0: Client;
    };
    readonly bossBars: {
        title: Text;
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
        item: itemName,
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
        destination: EntityLike | {
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
    kick(reason: textInput | Text): void;
    chat(message?: textInput | Text): void;
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
    entity(entityType: entityType, position: {
        x: number;
        y: number;
        z: number;
        yaw: number;
        pitch: number;
    }): EntityLike;
    window(windowType: nonEntityWindowName): void;
    signEditor(signLocation: {
        x: number;
        y: number;
        z: number;
    }): void;
    bossBar(bossBarInfo?: {
        title?: textInput | Text;
        health?: number;
        color?: bossBarColor;
        divisionAmount?: bossBarDivision;
        flags?: bossBarFlags;
    }): {
        title: Text;
        health: number;
        color: bossBarColor;
        divisionAmount: bossBarDivision;
        flags: bossBarFlags;
        id: string;
        remove(): void;
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

    on(event: 'misbehavior', callback: (customError: CustomError) => void): void;
    on(event: 'chat', callback: (message: string) => void): void;
    on(event: 'signEditorClose', callback: (signText: string[], location: {
        x: number;
        y: number;
        z: number;
    }) => void): void;
    on(event: 'itemHandSwap' | 'connect' | 'join' | 'leave', callback: () => void): void;
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
    on(event: 'leftClick', callback: () => void): void;
    on(event: 'rightClick', callback: (clickInfo: {
        position: {
            x: number;
            y: number;
            z: number;
        };
        isMainHand: boolean
    }) => void): void;

    once(event: 'misbehavior', callback: (customError: CustomError) => void): void;
    once(event: 'chat', callback: (message: string) => void): void;
    once(event: 'signEditorClose', callback: (signText: string[], location: {
        x: number;
        y: number;
        z: number;
    }) => void): void;
    once(event: 'itemHandSwap' | 'connect' | 'join' | 'leave', callback: () => void): void;
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
    once(event: 'leftClick', callback: () => void): void;
    once(event: 'rightClick', callback: (clickInfo: {
        position: {
            x: number;
            y: number;
            z: number;
        };
        isMainHand: boolean
    }) => void): void;
}

type bossBarColor = 'pink' | 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'white';
type bossBarDivision = 0 | 6 | 10 | 12 | 20;
type bossBarFlags = {
    darkenSky: boolean;
    playEndMusic: boolean;
    createFog: boolean;
};

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

    raining?: boolean;
    toxicRainLevel?: number;
    showRespawnScreen?: boolean;
    gamemode?: 'survival' | 'creative' | 'adventure' | 'spectator';
    difficulty?: 'peaceful' | 'easy' | 'normal' | 'hard';

    slot?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    health?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
    food?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
    foodSaturation?: 0 | 1 | 2 | 3 | 4 | 5;
};

type blockFace = `${'+' | '-'}${'X' | 'Y' | 'Z'}`;