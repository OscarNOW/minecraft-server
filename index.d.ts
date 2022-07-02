import { EventEmitter } from 'events';

export class Chunk {
    private chunk: any;
    constructor();
    setBlock(location: {
        x: number;
        y: number;
        z: number;
    }, block: blockType, state: blockState): Chunk;
}

export class Color {
    constructor(color: hex | rgb | hsl);
    constructor(red: number, green: number, blue: number);

    hex: hex;
    rgb: rgb;
    hsl: hsl;

    static rgbToHsl(rgb: rgb): hsl;
    static hslToRgb(hsl: hsl): rgb;
    static rgbToHex(rgb: rgb): hex;
    static hexToRgb(hex: hex): rgb;
}

export class Server extends EventEmitter {
    constructor(serverOptions: {
        serverList?(info: {
            ip: string,
            version: version | null,
            connection: {
                host: string | null,
                port: number | null
            },
            legacy: boolean
        }): {
            version?: {
                wrongText?: string | Text;
                correct?: version;
            };
            players?: {
                online?: number;
                max?: number;
                hover?: string | Array<{
                    name: string;
                    uuid: string;
                }>;
            };
            description?: string | Text;
        };
        wrongVersionConnect?(info: {
            ip: string,
            version: newVersion | 'legacy',
            connection: {
                host: string | null,
                port: number | null
            },
            legacy: boolean
        }): string | Text | null;
        defaultClientProperties?(client: Client): {
            slot?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

            reducedDebugInfo?: boolean;
            clearSky?: boolean;
            showRespawnScreen?: boolean;
            gamemode?: 'survival' | 'creative' | 'adventure' | 'spectator';

            health?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
            food?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
            foodSaturation?: 0 | 1 | 2 | 3 | 4 | 5;

            difficulty?: 'peaceful' | 'easy' | 'normal' | 'hard';
        };
    });

    private server: any;
    private intervals: NodeJS.Timer[];

    readonly clients: Array<Client>;
    readonly playerCount: number;

    close(): void;

    on(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    addListener(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    once(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    prependListener(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    prependOnceListener(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    off(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    removeListener(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    removeAllListeners(event?: 'join' | 'leave'): void;
    rawListeners(event: 'join' | 'leave'): ((client: Client) => void)[];
}

export class Text {
    constructor(text: string | optionalTextArray);

    array: textArray;
    string: string;

    static stringToArray(text: string): textArray;
    static parseArray(text: optionalTextArray): textArray;
    static arrayToString(text: optionalTextArray): string;
    static parseString(text: string): string;
}

declare class Changable {
    constructor(
        changeCallback: (values: {
            [valueName: string | symbol]: any;
        }) => void,
        startValues: {
            [valueName: string | symbol]: any;
        }
    );

    setRaw(values: {
        [valueName: string | symbol]: any;
    }): void;
    setRaw(key: string | symbol, value: any): void;

    [valueName: string | symbol]: any;
}

declare class Client extends EventEmitter {
    private constructor(client: any, server: Server, earlyInformation: {
        version: newVersion;
        ip: string;
        connection: {
            host: string;
            port: number;
        }
    }, defaultClientProperties?: (client: Client) => {
        slot?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
        position: {
            x: number;
            y: number;
            z: number;
            yaw?: number;
            pitch?: number;
        };

        clearSky?: boolean;
        showRespawnScreen?: boolean;
        gamemode?: 'survival' | 'creative' | 'adventure' | 'spectator';

        health?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
        food?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
        foodSaturation?: 0 | 1 | 2 | 3 | 4 | 5;

        difficulty?: 'peaceful' | 'easy' | 'normal' | 'hard';
    });

    readonly server: Server;
    readonly username: string;
    readonly uuid: string;
    readonly entityId: number;
    readonly ping: number;
    readonly online: boolean;
    readonly version: newVersion;
    readonly ip: string;
    readonly connection: {
        host: string;
        port: number
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
    readonly entities: {
        readonly [entityId: number]: Entity;
    };

    slot: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
    position: {
        x: number;
        y: number;
        z: number;
        yaw: number;
        pitch: number;
    };

    clearSky: boolean;
    showRespawnScreen: boolean;
    gamemode: 'survival' | 'creative' | 'adventure' | 'spectator';

    health: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
    food: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
    foodSaturation: 0 | 1 | 2 | 3 | 4 | 5;

    difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';

    observe(type: 'slot' | 'health' | 'food' | 'foodSaturation', callback: (changedValue: number) => void): void;
    observe(type: 'clearSky' | 'showRespawnScreen', callback: (changedValue: boolean) => void): void;
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
    demo(message: 'startScreen' | 'movement' | 'jump' | 'inventory' | 'endScreenshot'): void;
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

declare class CustomError {
    constructor(
        type: 'expectationNotMet',
        causer: 'client' | 'libraryUser' | 'library',
        names: string[][],
        expectationInfo: {
            got: any;
            expectationType: 'value';
            expectation: any[];
        } | {
            got: any;
            expectationType: 'type';
            expectation: string;
            externalLink?: string;
        },
        context?: Function);

    type: 'expectationNotMet';
    cause: 'client' | 'libraryUser';
    names: {
        value: string;
        function: string;
        class: string;
    };
    expectationInfo: {
        got: any;
        expectationType: 'value';
        expectation: any[];
    } | {
        got: any;
        expectationType: 'type';
        expectation: string;
        externalLink?: string;
    };
    context: Function;

    error: Error;
    toString(): Error;

    private generateMessage(): string;
}

declare class Entity extends EventEmitter {
    private constructor(client: Client, type: entityType, id: number, position: {
        x: number;
        y: number;
        z: number;
        yaw: number;
        pitch: number;
    }, sendPacket: (packetName: string, packet: object) => void);

    readonly id: number;
    readonly client: Client;
    readonly type: entityType;
    readonly living: boolean;

    position: {
        x: number;
        y: number;
        z: number;
        yaw: number;
        pitch: number;
    }

    camera(): void;

    animation(animationType: entityAnimationType): void;

    on(event: 'leftClick', callback: () => void): void;
    on(event: 'rightClick', callback: (
        position: {
            x: number;
            y: number;
            z: number;
        },
        isMainHand: boolean
    ) => void): void;

    addListener(event: 'leftClick', callback: () => void): void;
    addListener(event: 'rightClick', callback: (
        position: {
            x: number;
            y: number;
            z: number;
        },
        isMainHand: boolean
    ) => void): void;

    once(event: 'leftClick', callback: () => void): void;
    once(event: 'rightClick', callback: (
        position: {
            x: number;
            y: number;
            z: number;
        },
        isMainHand: boolean
    ) => void): void;

    prependListener(event: 'leftClick', callback: () => void): void;
    prependListener(event: 'rightClick', callback: (
        position: {
            x: number;
            y: number;
            z: number;
        },
        isMainHand: boolean
    ) => void): void;

    prependOnceListener(event: 'leftClick', callback: () => void): void;
    prependOnceListener(event: 'rightClick', callback: (
        position: {
            x: number;
            y: number;
            z: number;
        },
        isMainHand: boolean
    ) => void): void;

    off(event: 'leftClick', callback: () => void): void;
    off(event: 'rightClick', callback: (
        position: {
            x: number;
            y: number;
            z: number;
        },
        isMainHand: boolean
    ) => void): void;

    removeListener(event: 'leftClick', callback: () => void): void;
    removeListener(event: 'rightClick', callback: (
        position: {
            x: number;
            y: number;
            z: number;
        },
        isMainHand: boolean
    ) => void): void;

    rawListeners(event: 'leftClick'): (() => void)[];
    rawListeners(event: 'rightClick'): ((
        position: {
            x: number;
            y: number;
            z: number;
        },
        isMainHand: boolean
    ) => void)[];

    removeAllListeners(event?: 'leftClick' | 'rightClick'): void;
}


type hex = string;
type version = legacyVersion | newVersion;
type blockFace = `${'+' | '-'}${'X' | 'Y' | 'Z'}`;
type rgb = {
    r: number;
    g: number;
    b: number;
};
type hsl = {
    h: number;
    s: number;
    l: number;
};
type textModifier = 'bold' | 'italic' | 'underline' | 'strike' | 'random';
type entityAnimationType = 'swingMainHand' | 'flashRed' | 'leaveBed' | 'swingOffHand' | 'critical' | 'magicCritical';
type textArray = Array<{
    text: string;
    color: textColor;
    modifiers: Array<textModifier>;
}>;
type windowType = 'anvil' | 'beacon' | 'brewingStand' | 'chest' | 'container' | 'craftingTable' | 'dispenser' | 'dropper' | 'enchanting_table' | 'furnace' | 'hopper' | 'villager' /* | 'horse' */;
type textColor = 'darkRed' | 'red' | 'gold' | 'yellow' | 'darkGreen' | 'green' | 'aqua' | 'darkAqua' | 'darkBlue' | 'blue' | 'pink' | 'purple' | 'white' | 'gray' | 'darkGray' | 'black' | 'default';
type optionalTextArray = Array<{
    text: string;
    color?: textColor;
    modifiers?: Array<textModifier>;
} | string> | {
    text: string;
    color?: textColor;
    modifiers?: Array<textModifier>;
};
type noDataParticle = 'ambient_entity_effect' | 'angry_villager' | 'bubble' | 'cloud' | 'crit' | 'damage_indicator' | 'dragon_breath' | 'dripping_lava' | 'falling_lava' | 'landing_lava' | 'dripping_water' | 'falling_water' | 'effect' | 'elder_guardian' | 'enchanted_hit' | 'enchant' | 'end_rod' | 'entity_effect' | 'explosion_emitter' | 'explosion' | 'firework' | 'fishing' | 'flame' | 'soul_fire_flame' | 'soul' | 'flash' | 'happy_villager' | 'composter' | 'heart' | 'instant_effect' | 'item_slime' | 'item_snowball' | 'large_smoke' | 'lava' | 'mycelium' | 'note' | 'poof' | 'portal' | 'rain' | 'smoke' | 'sneeze' | 'spit' | 'sweep_attack' | 'totem_of_undying' | 'underwater' | 'splash' | 'witch' | 'bubble_pop' | 'current_down' | 'bubble_column_up' | 'nautilus' | 'dolphin' | 'campfire_cosy_smoke' | 'campfire_signal_smoke' | 'dripping_honey' | 'falling_honey' | 'landing_honey' | 'falling_nectar' | 'ash' | 'crimson_spore' | 'warped_spore' | 'dripping_obsidian_tear' | 'falling_obsidian_tear' | 'landing_obsidian_tear' | 'reverse_portal' | 'snowflake' | 'barrier';

type entityType = 'area_effect_cloud' | 'armor_stand' | 'arrow' | 'bat' | 'bee' | 'blaze' | 'boat' | 'cat' | 'cave_spider' | 'chicken' | 'cod' | 'cow' | 'creeper' | 'dolphin' | 'donkey' | 'dragon_fireball' | 'drowned' | 'elder_guardian' | 'end_crystal' | 'ender_dragon' | 'enderman' | 'endermite' | 'evoker' | 'evoker_fangs' | 'experience_orb' | 'eye_of_ender' | 'falling_block' | 'firework_rocket' | 'fox' | 'ghast' | 'giant' | 'guardian' | 'hoglin' | 'horse' | 'husk' | 'illusioner' | 'iron_golem' | 'item' | 'item_frame' | 'fireball' | 'leash_knot' | 'lightning_bolt' | 'llama' | 'llama_spit' | 'magma_cube' | 'minecart' | 'chest_minecart' | 'command_block_minecart' | 'furnace_minecart' | 'hopper_minecart' | 'spawner_minecart' | 'tnt_minecart' | 'mule' | 'mooshroom' | 'ocelot' | 'painting' | 'panda' | 'parrot' | 'phantom' | 'pig' | 'piglin' | 'piglin_brute' | 'pillager' | 'polar_bear' | 'tnt' | 'pufferfish' | 'rabbit' | 'ravager' | 'salmon' | 'sheep' | 'shulker' | 'shulker_bullet' | 'silverfish' | 'skeleton' | 'skeleton_horse' | 'slime' | 'small_fireball' | 'snow_golem' | 'snowball' | 'spectral_arrow' | 'spider' | 'squid' | 'stray' | 'strider' | 'egg' | 'ender_pearl' | 'experience_bottle' | 'potion' | 'trident' | 'trader_llama' | 'tropical_fish' | 'turtle' | 'vex' | 'villager' | 'vindicator' | 'wandering_trader' | 'witch' | 'wither' | 'wither_skeleton' | 'wither_skull' | 'wolf' | 'zoglin' | 'zombie' | 'zombie_horse' | 'zombie_villager' | 'zombified_piglin' | 'player' | 'fishing_bobber';

type blockState = {
        snowy?: boolean;
    stage?: 0 | 1;
    level?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
    axis?: 'x' | 'y' | 'z';
    persistent?: boolean;
    distance?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | '1' | '2' | '3' | '4' | '5' | '6' | '7';
    triggered?: boolean;
    facing?: 'north' | 'south' | 'west' | 'east' | 'up' | 'down';
    powered?: boolean;
    note?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;
    instrument?: 'harp' | 'basedrum' | 'snare' | 'hat' | 'bass' | 'flute' | 'bell' | 'guitar' | 'chime' | 'xylophone' | 'iron_xylophone' | 'cow_bell' | 'didgeridoo' | 'bit' | 'banjo' | 'pling';
    part?: 'head' | 'foot';
    occupied?: boolean;
    shape?: 'straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right' | 'north_south' | 'east_west' | 'ascending_east' | 'ascending_west' | 'ascending_north' | 'ascending_south' | 'south_east' | 'south_west' | 'north_west' | 'north_east';
    extended?: boolean;
    half?: 'top' | 'bottom' | 'upper' | 'lower';
    type?: 'top' | 'bottom' | 'double' | 'single' | 'left' | 'right' | 'normal' | 'sticky';
    short?: boolean;
    unstable?: boolean;
    west?: 'none' | 'low' | 'tall' | true | false | 'up' | 'side';
    up?: boolean;
    south?: 'none' | 'low' | 'tall' | true | false | 'up' | 'side';
    north?: 'none' | 'low' | 'tall' | true | false | 'up' | 'side';
    east?: 'none' | 'low' | 'tall' | true | false | 'up' | 'side';
    age?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25;
    waterlogged?: boolean;
    power?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
    moisture?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    lit?: boolean;
    rotation?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
    open?: boolean;
    hinge?: 'left' | 'right';
    face?: 'floor' | 'wall' | 'ceiling';
    layers?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
    has_record?: boolean;
    bites?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    locked?: boolean;
    delay?: '1' | '2' | '3' | '4';
    down?: boolean;
    in_wall?: boolean;
    has_bottle_2?: boolean;
    has_bottle_1?: boolean;
    has_bottle_0?: boolean;
    eye?: boolean;
    attached?: boolean;
    disarmed?: boolean;
    conditional?: boolean;
    mode?: 'save' | 'load' | 'corner' | 'data' | 'compare' | 'subtract';
    inverted?: boolean;
    enabled?: boolean;
    hatch?: 0 | 1 | 2;
    eggs?: '1' | '2' | '3' | '4';
    pickles?: '1' | '2' | '3' | '4';
    leaves?: 'none' | 'small' | 'large';
    drag?: boolean;
    bottom?: boolean;
    has_book?: boolean;
    attachment?: 'floor' | 'ceiling' | 'single_wall' | 'double_wall';
    hanging?: boolean;
    signal_fire?: boolean;
    orientation?: 'down_east' | 'down_north' | 'down_south' | 'down_west' | 'up_east' | 'up_north' | 'up_south' | 'up_west' | 'west_up' | 'east_up' | 'north_up' | 'south_up';
    honey_level?: 0 | 1 | 2 | 3 | 4 | 5;
    charges?: 0 | 1 | 2 | 3 | 4;
    };

type legacyVersion = '13w39b' | '13w39a' | '13w38c' | '13w38b' | '13w38a' | '1.6.4' | '1.6.3' | '13w37b' | '13w37a' | '13w36b' | '13w36a' | '1.6.2' | '1.6.1' | '1.6' | '13w26a' | '13w25c' | '13w25b' | '13w25a' | '13w24b' | '13w24a' | '13w23b' | '13w23a' | '13w22a' | '13w21b' | '13w21a' | '13w19a' | '13w18c' | '13w18b' | '13w18a' | '13w17a' | '13w16b' | '13w16a' | '1.5.2' | '1.5.1' | '13w12~' | '13w11a' | '1.5' | '13w10b' | '13w10a' | '13w09c' | '13w09b' | '13w09a' | '13w07a' | '13w06a' | '13w05b' | '13w05a' | '13w04a' | '13w03a' | '13w02b' | '13w02a' | '13w01b' | '13w01a' | '1.4.7' | '1.4.6' | '12w50b' | '12w50a' | '12w49a' | '1.4.5' | '1.4.4' | '1.4.3' | '1.4.2' | '1.4.1' | '1.4' | '12w42b' | '12w42a' | '12w41b' | '12w41a' | '12w40b' | '12w40a' | '12w39b' | '12w39a' | '12w38b' | '12w38a' | '12w37a' | '12w36a' | '12w34b' | '12w34a' | '12w32a' | '1.3.2' | '1.3.1' | '1.3' | '12w30e' | '12w30d' | '12w30c' | '12w30b' | '12w30a' | '12w27a' | '12w26a' | '12w25a' | '12w24a' | '12w23b' | '12w23a' | '12w22a' | '12w21b' | '12w21a' | '12w19a' | '12w18a' | '12w17a' | '12w16a' | '12w15a' | '1.2.5' | '1.2.4' | '1.2.3' | '1.2.2' | '1.2.1' | '1.2' | '12w08a' | '12w07b' | '12w07a' | '12w06a' | '12w05b' | '12w05a' | '12w04a' | '12w03a' | '1.1' | '12w01a' | '11w50a' | '11w49a' | '11w48a' | '11w47a' | '1.0.1' | '1.0.0' | 'RC2' | 'RC1' | 'Beta 1.9 Prerelease 6' | 'Beta 1.9 Prerelease 5' | 'Beta 1.9 Prerelease 4' | 'Beta 1.9 Prerelease 3' | 'Beta 1.9 Prerelease 2' | 'Beta 1.9 Prerelease' | 'Beta 1.8.1' | 'Beta 1.8' | 'Beta 1.8 Pre-release 2 ' | 'Beta 1.8 Pre-release' | 'Beta 1.7.3' | 'Beta 1.7.2' | 'Beta 1.7_01' | 'Beta 1.7' | 'Beta 1.6.6' | 'Beta 1.6.5' | 'Beta 1.6.4' | 'Beta 1.6.3' | 'Beta 1.6.2' | 'Beta 1.6.1' | 'Beta 1.6' | 'Beta 1.6 Test Build 3' | 'Beta 1.5_02' | 'Beta 1.5_01' | 'Beta 1.5' | 'Beta 1.4_01' | 'Beta 1.4' | 'Beta 1.3_01' | 'Beta 1.3' | 'Beta 1.2_02' | 'Beta 1.2_01' | 'Beta 1.2' | 'Beta 1.1_02' | 'Beta 1.1_01' | 'Beta 1.1' | 'Beta 1.0.2' | 'Beta 1.0_01' | 'Beta 1.0' | 'Alpha server 0.2.8' | 'Alpha v1.2.6' | 'Alpha server 0.2.7' | 'Alpha v1.2.5' | 'Alpha server 0.2.6_02' | 'Alpha v1.2.4_01' | 'Alpha server 0.2.6_01' | 'Alpha server 0.2.6' | 'Alpha v1.2.3_05' | 'Alpha v1.2.3_04' | 'Alpha server 0.2.5_02' | 'Alpha server 0.2.5_01' | 'Alpha v1.2.3_02' | 'Alpha v1.2.3_01' | 'Alpha server 0.2.5' | 'Alpha v1.2.3' | 'Alpha server 0.2.4' | 'Alpha v1.2.2' | 'Alpha v1.2.1_01' | 'Alpha server 0.2.3' | 'Alpha v1.2.1' | 'Alpha v1.2.0_02' | 'Alpha v1.2.0_01' | 'Alpha server 0.2.2_01' | 'Alpha server 0.2.2' | 'Alpha v1.2.0' | 'Alpha v1.1.2_01' | 'Alpha v1.1.2' | 'Alpha server 0.2.1' | 'Alpha v1.1.1' | 'Alpha server 0.2.0_01' | 'Alpha server 0.2.0' | 'Alpha v1.1.0' | 'Alpha v1.0.17_04' | 'Alpha v1.0.17_03' | 'Alpha v1.0.17_02' | 'Alpha server 0.1.4' | 'Alpha server 0.1.3' | 'Alpha v1.0.16_02' | 'Alpha server 0.1.2_01' | 'Alpha server 0.1.2' | 'Alpha v1.0.16_01' | 'Alpha server 0.1.1' | 'Alpha v1.0.16' | 'Alpha server 0.1.0' | 'Alpha v1.0.15' | 'Alpha v1.0.14' | 'Alpha v1.0.13_01' | 'Alpha v1.0.13' | 'Alpha v1.0.12' | 'Alpha v1.0.11' | 'Alpha v1.0.10' | 'Alpha v1.0.9' | 'Alpha v1.0.8_01' | 'Alpha v1.0.8' | 'Alpha v1.0.7' | 'Alpha v1.0.6_03' | 'Alpha v1.0.6_02' | 'Alpha v1.0.6_01' | 'Alpha v1.0.6' | 'Alpha v1.0.5_01' | 'Alpha v1.0.5' | 'Classic server 1.10.1' | 'Classic server 1.10' | 'Classic 0.30' | 'Classic 0.29_02' | 'Classic 0.29_01' | 'Classic 0.29' | 'Classic 0.28_01' | 'Classic server 1.9' | 'Classic server 1.8.3' | 'Classic 0.27 SURVIVAL TEST' | 'Classic 0.26 SURVIVAL TEST' | 'Classic 0.25_05 SURVIVAL TEST' | 'Classic 0.25 SURVIVAL TEST' | 'Classic 0.24_SURVIVAL_TEST_03' | 'Classic 0.24_SURVIVAL_TEST_02' | 'Classic 0.24_SURVIVAL_TEST_01' | 'Classic 0.24_SURVIVAL_TEST' | 'Classic 0.0.23a_01' | 'Classic 0.0.23a' | 'Classic 0.0.22a_05' | 'Classic 0.0.22a_04' | 'Classic 0.0.22a_03' | 'Classic 0.0.22a_02' | 'Classic 0.0.22a_01' | 'Classic 0.0.22a' | 'Classic 0.0.21a_01' | 'Classic 0.0.21a' | 'Classic 0.0.20a_02' | 'Classic server 1.8.2' | 'Classic 0.0.20a_01' | 'Classic server 1.8.1' | 'Classic server 1.8' | 'Classic server 1.7' | 'Classic server 1.6' | 'Classic server 1.5' | 'Classic 0.0.18a_02' | 'Classic server 1.4.1' | 'Classic server 1.4' | 'Classic server 1.3' | 'Classic 0.0.17a' | 'Classic server 1.2' | 'Classic 0.0.16a_02';

type newVersion = '22w19a' | '22w18a' | '22w17a' | '22w16b' | '22w16a' | '22w15a' | '22w14a' | '22w13a' | '22w12a' | '22w11a' | 'Deep Dark Experimental Snapshot 1' | '1.18.2' | '1.18.2 Release Candidate 1' | '1.18.2 Pre-release 3' | '1.18.2 Pre-release 2' | '1.18.2 Pre-release 1' | '22w07a' | '22w06a' | '22w05a' | '22w03a' | '1.18.1' | '1.18.1 Release Candidate 3' | '1.18.1 Release Candidate 2' | '1.18.1 Release Candidate 1' | '1.18.1 Pre-release 1' | '1.18' | '1.18 Release Candidate 4' | '1.18 Release Candidate 3' | '1.18 Release Candidate 2' | '1.18 Release Candidate 1' | '1.18 Pre-release 8' | '1.18 Pre-release 7' | '1.18 Pre-release 6' | '1.18 Pre-release 5' | '1.18 Pre-release 4' | '1.18 Pre-release 3' | '1.18 Pre-release 2' | '1.18 Pre-release 1' | '21w44a' | '21w43a' | '21w42a' | '21w41a' | '21w40a' | '21w39a' | '21w38a' | '21w37a' | '1.18 experimental snapshot 7' | '1.18 experimental snapshot 6' | '1.18 experimental snapshot 5' | '1.18 experimental snapshot 4' | '1.18 experimental snapshot 3' | '1.18 experimental snapshot 2' | '1.18 Experimental Snapshot 1' | '1.17.1' | '1.17.1 Release Candidate 2' | '1.17.1 Release Candidate 1' | '1.17.1 Pre-release 3' | '1.17.1 Pre-release 2' | '1.17.1 Pre-release 1' | '1.17' | '1.17 Release Candidate 2' | '1.17 Release Candidate 1' | '1.17 Pre-release 5' | '1.17 Pre-release 4' | '1.17 Pre-release 3' | '1.17 Pre-release 2' | '1.17 Pre-release 1' | '21w20a' | '21w19a' | '21w18a' | '21w17a' | '21w16a' | '21w15a' | '21w14a' | '21w13a' | '21w11a' | '21w10a' | '21w08b' | '21w08a' | '21w07a' | '21w06a' | '21w05b' | '21w05a' | '21w03a' | '20w51a' | '20w49a' | '20w48a' | '20w46a' | '20w45a' | 'Combat Test 8c' | 'Combat Test 7c' | 'Combat Test 6' | '1.16.5' | '1.16.5 Release Candidate 1' | '1.16.4' | '1.16.4 Release Candidate 1' | '1.16.4 Pre-release 2' | '1.16.4 Pre-release 1' | '1.16.3' | '1.16.3 Release Candidate 1' | '1.16.2' | '1.16.2 Release Candidate 2' | '1.16.2 Release Candidate 1' | '1.16.2 Pre-release 3' | '1.16.2 Pre-release 2' | '1.16.2 Pre-release 1' | '20w30a' | '20w29a' | '20w28a' | '20w27a' | '1.16.1' | '1.16' | '1.16 Release Candidate 1' | '1.16 Pre-release 8' | '1.16 Pre-release 7' | '1.16 Pre-release 6' | '1.16 Pre-release 5' | '1.16 Pre-release 4' | '1.16 Pre-release 3' | '1.16 Pre-release 2' | '1.16 Pre-release 1' | '20w22a' | '20w21a' | '20w20b' | '20w20a' | '20w19a' | '20w18a' | '20w17a' | '20w16a' | '20w15a' | '20w14a' | '20w13b' | '20w13a' | '20w12a' | '20w11a' | '20w10a' | '20w09a' | '20w08a' | '20w07a' | 'Snapshot 20w06a' | 'Combat Test 5' | 'Combat Test 4' | '1.15.2' | '1.15.2 Pre-release 2' | '1.15.2 Pre-Release 1' | '1.15.1' | '1.15.1 Pre-release 1' | '1.15' | '1.15 Pre-release 7' | '1.15 Pre-release 6' | '1.15 Pre-release 5' | '1.15 Pre-release 4' | '1.15 Pre-release 3' | '1.15 Pre-Release 2' | '1.15 Pre-release 1' | '19w46b' | '19w46a' | '19w45b' | '19w45a' | '19w44a' | '19w42a' | '19w41a' | '19w40a' | '19w39a' | '19w38b' | '19w38a' | '19w37a' | '19w36a' | '19w35a' | '19w34a' | 'Combat Test 3' | 'Combat Test 2' | '1.14.3 - Combat Test' | '1.14.4' | '1.14.4 Pre-Release 7' | '1.14.4 Pre-Release 6' | '1.14.4 Pre-Release 5' | '1.14.4 Pre-Release 4' | '1.14.4 Pre-Release 3' | '1.14.4 Pre-Release 2' | '1.14.4 Pre-Release 1' | '1.14.3' | '1.14.3 Pre-Release 4' | '1.14.3 Pre-Release 3' | '1.14.3 Pre-Release 2' | '1.14.3 Pre-Release 1' | '1.14.2' | '1.14.2 Pre-Release 4' | '1.14.2 Pre-Release 3' | '1.14.2 Pre-Release 2' | '1.14.2 Pre-Release 1' | '1.14.1' | '1.14.1 Pre-Release 2' | '1.14.1 Pre-Release 1' | '1.14' | '1.14 Pre-Release 5' | '1.14 Pre-Release 4' | '1.14 Pre-Release 3' | '1.14 Pre-Release 2' | '1.14 Pre-Release 1' | '19w14b' | '19w14a' | '19w13b' | '19w13a' | '19w12b' | '19w12a' | '19w11b' | '19w11a' | '19w09a' | '19w08b' | '19w08a' | '19w07a' | '19w06a' | '19w05a' | '19w04b' | '19w04a' | '19w03c' | '19w03b' | '19w03a' | '19w02a' | '18w50a' | '18w49a' | '18w48b' | '18w48a' | '18w47b' | '18w47a' | '18w46a' | '18w45a' | '18w44a' | '18w43c' | '18w43b' | '18w43a' | '1.13.2' | '1.13.2-pre2' | '1.13.2-pre1' | '1.13.1' | '1.13.1-pre2' | '1.13.1-pre1' | '18w33a' | '18w32a' | '18w31a' | '18w30b' | '18w30a' | '1.13' | '1.13-pre10' | '1.13-pre9' | '1.13-pre8' | '1.13-pre7' | '1.13-pre6' | '1.13-pre5' | '1.13-pre4' | '1.13-pre3' | '1.13-pre2' | '1.13-pre1' | '18w22c' | '18w22b' | '18w22a' | '18w21b' | '18w21a' | '18w20c' | '18w20b' | '18w20a' | '18w19b' | '18w19a' | '18w16a' | '18w15a' | '18w14b' | '18w14a' | '18w11a' | '18w10d' | '18w10c' | '18w10b' | '18w10a' | '18w09a' | '18w08b' | '18w08a' | '18w07c' | '18w07b' | '18w07a' | '18w06a' | '18w05a' | '18w03b' | '18w03a' | '18w02a' | '18w01a' | '17w50a' | '17w49b' | '17w49a' | '17w48a' | '17w47b' | '17w47a' | '17w46a' | '17w45b' | '17w45a' | '17w43b' | '17w43a' | '1.12.2' | '1.12.2-pre2' | '1.12.1' | '1.12.1-pre1' | '17w31a' | '1.12' | '1.12-pre7' | '1.12-pre6' | '1.12-pre5' | '1.12-pre4' | '1.12-pre3' | '1.12-pre2' | '1.12-pre1' | '17w18b' | '17w18a' | '17w17b' | '17w17a' | '17w16b' | '17w16a' | '17w15a' | '17w14a' | '17w13b' | '17w13a' | '17w06a' | '1.11.2' | '1.11' | '1.11-pre1' | '16w44a' | '16w42a' | '16w41a' | '16w40a' | '16w39c' | '16w39b' | '16w39a' | '16w38a' | '16w36a' | '16w35a' | '16w33a' | '16w32b' | '16w32a' | '1.10.2' | '1.10-pre2' | '1.10-pre1' | '16w21b' | '16w21a' | '16w20a' | '1.9.4' | '1.9.3-pre1' | '1.9.1' | '1.9.1-pre1' | '1.9-pre4' | '1.9-pre3' | '1.9-pre2' | '1.9-pre1' | '16w07b' | '16w07a' | '16w06a' | '16w05b' | '16w05a' | '16w04a' | '16w03a' | '16w02a' | '15w51b' | '15w51a' | '15w50a' | '15w49b' | '15w49a' | '15w47c' | '15w47b' | '15w47a' | '15w46a' | '15w45a' | '15w44b' | '15w44a' | '15w43c' | '15w43b' | '15w43a' | '15w42a' | '15w41b' | '15w41a' | '15w40b' | '15w40a' | '15w39c' | '15w38b' | '15w38a' | '15w37a' | '15w36d' | '15w36c' | '15w36b' | '15w36a' | '15w35e' | '15w35d' | '15w35c' | '15w35b' | '15w35a' | '15w34d' | '15w34c' | '15w34b' | '15w34a' | '15w33c' | '15w33b' | '15w33a' | '15w32c' | '15w32b' | '15w32a' | '15w31c' | '15w31b' | '15w31a' | '1.8.9' | '1.8-pre3' | '1.8-pre2' | '1.8-pre1' | '14w34d' | '14w34c' | '14w34b' | '14w34a' | '14w33c' | '14w33b' | '14w33a' | '14w32d' | '14w32c' | '14w32b' | '14w32a' | '14w31a' | '14w30c' | '14w30b' | '14w29b' | '14w28b' | '14w28a' | '14w27b' | '14w26c' | '14w26b' | '14w26a' | '14w25b' | '14w25a' | '14w21b' | '14w21a' | '14w20b' | '14w19a' | '14w18b' | '14w17a' | '14w11b' | '14w10c' | '14w08a' | '14w07a' | '14w06b' | '14w05b' | '14w04b' | '14w04a' | '14w03b' | '14w02c' | '1.7.5' | '1.7.1' | '13w43a' | '13w42b' | '13w41b' | '13w41a';

type blockType = 'air' | 'stone' | 'granite' | 'polished_granite' | 'diorite' | 'polished_diorite' | 'andesite' | 'polished_andesite' | 'grass_block' | 'dirt' | 'coarse_dirt' | 'podzol' | 'cobblestone' | 'oak_planks' | 'spruce_planks' | 'birch_planks' | 'jungle_planks' | 'acacia_planks' | 'dark_oak_planks' | 'oak_sapling' | 'spruce_sapling' | 'birch_sapling' | 'jungle_sapling' | 'acacia_sapling' | 'dark_oak_sapling' | 'bedrock' | 'water' | 'lava' | 'sand' | 'red_sand' | 'gravel' | 'gold_ore' | 'iron_ore' | 'coal_ore' | 'nether_gold_ore' | 'oak_log' | 'spruce_log' | 'birch_log' | 'jungle_log' | 'acacia_log' | 'dark_oak_log' | 'stripped_spruce_log' | 'stripped_birch_log' | 'stripped_jungle_log' | 'stripped_acacia_log' | 'stripped_dark_oak_log' | 'stripped_oak_log' | 'oak_wood' | 'spruce_wood' | 'birch_wood' | 'jungle_wood' | 'acacia_wood' | 'dark_oak_wood' | 'stripped_oak_wood' | 'stripped_spruce_wood' | 'stripped_birch_wood' | 'stripped_jungle_wood' | 'stripped_acacia_wood' | 'stripped_dark_oak_wood' | 'oak_leaves' | 'spruce_leaves' | 'birch_leaves' | 'jungle_leaves' | 'acacia_leaves' | 'dark_oak_leaves' | 'sponge' | 'wet_sponge' | 'glass' | 'lapis_ore' | 'lapis_block' | 'dispenser' | 'sandstone' | 'chiseled_sandstone' | 'cut_sandstone' | 'note_block' | 'white_bed' | 'orange_bed' | 'magenta_bed' | 'light_blue_bed' | 'yellow_bed' | 'lime_bed' | 'pink_bed' | 'gray_bed' | 'light_gray_bed' | 'cyan_bed' | 'purple_bed' | 'blue_bed' | 'brown_bed' | 'green_bed' | 'red_bed' | 'black_bed' | 'powered_rail' | 'detector_rail' | 'sticky_piston' | 'cobweb' | 'grass' | 'fern' | 'dead_bush' | 'seagrass' | 'tall_seagrass' | 'piston' | 'piston_head' | 'white_wool' | 'orange_wool' | 'magenta_wool' | 'light_blue_wool' | 'yellow_wool' | 'lime_wool' | 'pink_wool' | 'gray_wool' | 'light_gray_wool' | 'cyan_wool' | 'purple_wool' | 'blue_wool' | 'brown_wool' | 'green_wool' | 'red_wool' | 'black_wool' | 'moving_piston' | 'dandelion' | 'poppy' | 'blue_orchid' | 'allium' | 'azure_bluet' | 'red_tulip' | 'orange_tulip' | 'white_tulip' | 'pink_tulip' | 'oxeye_daisy' | 'cornflower' | 'wither_rose' | 'lily_of_the_valley' | 'brown_mushroom' | 'red_mushroom' | 'gold_block' | 'iron_block' | 'bricks' | 'tnt' | 'bookshelf' | 'mossy_cobblestone' | 'obsidian' | 'torch' | 'wall_torch' | 'fire' | 'soul_fire' | 'spawner' | 'oak_stairs' | 'chest' | 'redstone_wire' | 'diamond_ore' | 'diamond_block' | 'crafting_table' | 'wheat' | 'farmland' | 'furnace' | 'oak_sign' | 'spruce_sign' | 'birch_sign' | 'acacia_sign' | 'jungle_sign' | 'dark_oak_sign' | 'oak_door' | 'ladder' | 'rail' | 'cobblestone_stairs' | 'oak_wall_sign' | 'spruce_wall_sign' | 'birch_wall_sign' | 'acacia_wall_sign' | 'jungle_wall_sign' | 'dark_oak_wall_sign' | 'lever' | 'stone_pressure_plate' | 'iron_door' | 'oak_pressure_plate' | 'spruce_pressure_plate' | 'birch_pressure_plate' | 'jungle_pressure_plate' | 'acacia_pressure_plate' | 'dark_oak_pressure_plate' | 'redstone_ore' | 'redstone_torch' | 'redstone_wall_torch' | 'stone_button' | 'snow' | 'ice' | 'snow_block' | 'cactus' | 'clay' | 'sugar_cane' | 'jukebox' | 'oak_fence' | 'pumpkin' | 'netherrack' | 'soul_sand' | 'soul_soil' | 'basalt' | 'polished_basalt' | 'soul_torch' | 'soul_wall_torch' | 'glowstone' | 'nether_portal' | 'carved_pumpkin' | 'jack_o_lantern' | 'cake' | 'repeater' | 'white_stained_glass' | 'orange_stained_glass' | 'magenta_stained_glass' | 'light_blue_stained_glass' | 'yellow_stained_glass' | 'lime_stained_glass' | 'pink_stained_glass' | 'gray_stained_glass' | 'light_gray_stained_glass' | 'cyan_stained_glass' | 'purple_stained_glass' | 'blue_stained_glass' | 'brown_stained_glass' | 'green_stained_glass' | 'red_stained_glass' | 'black_stained_glass' | 'oak_trapdoor' | 'spruce_trapdoor' | 'birch_trapdoor' | 'jungle_trapdoor' | 'acacia_trapdoor' | 'dark_oak_trapdoor' | 'stone_bricks' | 'mossy_stone_bricks' | 'cracked_stone_bricks' | 'chiseled_stone_bricks' | 'infested_stone' | 'infested_cobblestone' | 'infested_stone_bricks' | 'infested_mossy_stone_bricks' | 'infested_cracked_stone_bricks' | 'infested_chiseled_stone_bricks' | 'brown_mushroom_block' | 'red_mushroom_block' | 'mushroom_stem' | 'iron_bars' | 'chain' | 'glass_pane' | 'melon' | 'attached_pumpkin_stem' | 'attached_melon_stem' | 'pumpkin_stem' | 'melon_stem' | 'vine' | 'oak_fence_gate' | 'brick_stairs' | 'stone_brick_stairs' | 'mycelium' | 'lily_pad' | 'nether_bricks' | 'nether_brick_fence' | 'nether_brick_stairs' | 'nether_wart' | 'enchanting_table' | 'brewing_stand' | 'cauldron' | 'end_portal' | 'end_portal_frame' | 'end_stone' | 'dragon_egg' | 'redstone_lamp' | 'cocoa' | 'sandstone_stairs' | 'emerald_ore' | 'ender_chest' | 'tripwire_hook' | 'tripwire' | 'emerald_block' | 'spruce_stairs' | 'birch_stairs' | 'jungle_stairs' | 'command_block' | 'beacon' | 'cobblestone_wall' | 'mossy_cobblestone_wall' | 'flower_pot' | 'potted_oak_sapling' | 'potted_spruce_sapling' | 'potted_birch_sapling' | 'potted_jungle_sapling' | 'potted_acacia_sapling' | 'potted_dark_oak_sapling' | 'potted_fern' | 'potted_dandelion' | 'potted_poppy' | 'potted_blue_orchid' | 'potted_allium' | 'potted_azure_bluet' | 'potted_red_tulip' | 'potted_orange_tulip' | 'potted_white_tulip' | 'potted_pink_tulip' | 'potted_oxeye_daisy' | 'potted_cornflower' | 'potted_lily_of_the_valley' | 'potted_wither_rose' | 'potted_red_mushroom' | 'potted_brown_mushroom' | 'potted_dead_bush' | 'potted_cactus' | 'carrots' | 'potatoes' | 'oak_button' | 'spruce_button' | 'birch_button' | 'jungle_button' | 'acacia_button' | 'dark_oak_button' | 'skeleton_skull' | 'skeleton_wall_skull' | 'wither_skeleton_skull' | 'wither_skeleton_wall_skull' | 'zombie_head' | 'zombie_wall_head' | 'player_head' | 'player_wall_head' | 'creeper_head' | 'creeper_wall_head' | 'dragon_head' | 'dragon_wall_head' | 'anvil' | 'chipped_anvil' | 'damaged_anvil' | 'trapped_chest' | 'light_weighted_pressure_plate' | 'heavy_weighted_pressure_plate' | 'comparator' | 'daylight_detector' | 'redstone_block' | 'nether_quartz_ore' | 'hopper' | 'quartz_block' | 'chiseled_quartz_block' | 'quartz_pillar' | 'quartz_stairs' | 'activator_rail' | 'dropper' | 'white_terracotta' | 'orange_terracotta' | 'magenta_terracotta' | 'light_blue_terracotta' | 'yellow_terracotta' | 'lime_terracotta' | 'pink_terracotta' | 'gray_terracotta' | 'light_gray_terracotta' | 'cyan_terracotta' | 'purple_terracotta' | 'blue_terracotta' | 'brown_terracotta' | 'green_terracotta' | 'red_terracotta' | 'black_terracotta' | 'white_stained_glass_pane' | 'orange_stained_glass_pane' | 'magenta_stained_glass_pane' | 'light_blue_stained_glass_pane' | 'yellow_stained_glass_pane' | 'lime_stained_glass_pane' | 'pink_stained_glass_pane' | 'gray_stained_glass_pane' | 'light_gray_stained_glass_pane' | 'cyan_stained_glass_pane' | 'purple_stained_glass_pane' | 'blue_stained_glass_pane' | 'brown_stained_glass_pane' | 'green_stained_glass_pane' | 'red_stained_glass_pane' | 'black_stained_glass_pane' | 'acacia_stairs' | 'dark_oak_stairs' | 'slime_block' | 'barrier' | 'iron_trapdoor' | 'prismarine' | 'prismarine_bricks' | 'dark_prismarine' | 'prismarine_stairs' | 'prismarine_brick_stairs' | 'dark_prismarine_stairs' | 'prismarine_slab' | 'prismarine_brick_slab' | 'dark_prismarine_slab' | 'sea_lantern' | 'hay_block' | 'white_carpet' | 'orange_carpet' | 'magenta_carpet' | 'light_blue_carpet' | 'yellow_carpet' | 'lime_carpet' | 'pink_carpet' | 'gray_carpet' | 'light_gray_carpet' | 'cyan_carpet' | 'purple_carpet' | 'blue_carpet' | 'brown_carpet' | 'green_carpet' | 'red_carpet' | 'black_carpet' | 'terracotta' | 'coal_block' | 'packed_ice' | 'sunflower' | 'lilac' | 'rose_bush' | 'peony' | 'tall_grass' | 'large_fern' | 'white_banner' | 'orange_banner' | 'magenta_banner' | 'light_blue_banner' | 'yellow_banner' | 'lime_banner' | 'pink_banner' | 'gray_banner' | 'light_gray_banner' | 'cyan_banner' | 'purple_banner' | 'blue_banner' | 'brown_banner' | 'green_banner' | 'red_banner' | 'black_banner' | 'white_wall_banner' | 'orange_wall_banner' | 'magenta_wall_banner' | 'light_blue_wall_banner' | 'yellow_wall_banner' | 'lime_wall_banner' | 'pink_wall_banner' | 'gray_wall_banner' | 'light_gray_wall_banner' | 'cyan_wall_banner' | 'purple_wall_banner' | 'blue_wall_banner' | 'brown_wall_banner' | 'green_wall_banner' | 'red_wall_banner' | 'black_wall_banner' | 'red_sandstone' | 'chiseled_red_sandstone' | 'cut_red_sandstone' | 'red_sandstone_stairs' | 'oak_slab' | 'spruce_slab' | 'birch_slab' | 'jungle_slab' | 'acacia_slab' | 'dark_oak_slab' | 'stone_slab' | 'smooth_stone_slab' | 'sandstone_slab' | 'cut_sandstone_slab' | 'petrified_oak_slab' | 'cobblestone_slab' | 'brick_slab' | 'stone_brick_slab' | 'nether_brick_slab' | 'quartz_slab' | 'red_sandstone_slab' | 'cut_red_sandstone_slab' | 'purpur_slab' | 'smooth_stone' | 'smooth_sandstone' | 'smooth_quartz' | 'smooth_red_sandstone' | 'spruce_fence_gate' | 'birch_fence_gate' | 'jungle_fence_gate' | 'acacia_fence_gate' | 'dark_oak_fence_gate' | 'spruce_fence' | 'birch_fence' | 'jungle_fence' | 'acacia_fence' | 'dark_oak_fence' | 'spruce_door' | 'birch_door' | 'jungle_door' | 'acacia_door' | 'dark_oak_door' | 'end_rod' | 'chorus_plant' | 'chorus_flower' | 'purpur_block' | 'purpur_pillar' | 'purpur_stairs' | 'end_stone_bricks' | 'beetroots' | 'grass_path' | 'end_gateway' | 'repeating_command_block' | 'chain_command_block' | 'frosted_ice' | 'magma_block' | 'nether_wart_block' | 'red_nether_bricks' | 'bone_block' | 'structure_void' | 'observer' | 'shulker_box' | 'white_shulker_box' | 'orange_shulker_box' | 'magenta_shulker_box' | 'light_blue_shulker_box' | 'yellow_shulker_box' | 'lime_shulker_box' | 'pink_shulker_box' | 'gray_shulker_box' | 'light_gray_shulker_box' | 'cyan_shulker_box' | 'purple_shulker_box' | 'blue_shulker_box' | 'brown_shulker_box' | 'green_shulker_box' | 'red_shulker_box' | 'black_shulker_box' | 'white_glazed_terracotta' | 'orange_glazed_terracotta' | 'magenta_glazed_terracotta' | 'light_blue_glazed_terracotta' | 'yellow_glazed_terracotta' | 'lime_glazed_terracotta' | 'pink_glazed_terracotta' | 'gray_glazed_terracotta' | 'light_gray_glazed_terracotta' | 'cyan_glazed_terracotta' | 'purple_glazed_terracotta' | 'blue_glazed_terracotta' | 'brown_glazed_terracotta' | 'green_glazed_terracotta' | 'red_glazed_terracotta' | 'black_glazed_terracotta' | 'white_concrete' | 'orange_concrete' | 'magenta_concrete' | 'light_blue_concrete' | 'yellow_concrete' | 'lime_concrete' | 'pink_concrete' | 'gray_concrete' | 'light_gray_concrete' | 'cyan_concrete' | 'purple_concrete' | 'blue_concrete' | 'brown_concrete' | 'green_concrete' | 'red_concrete' | 'black_concrete' | 'white_concrete_powder' | 'orange_concrete_powder' | 'magenta_concrete_powder' | 'light_blue_concrete_powder' | 'yellow_concrete_powder' | 'lime_concrete_powder' | 'pink_concrete_powder' | 'gray_concrete_powder' | 'light_gray_concrete_powder' | 'cyan_concrete_powder' | 'purple_concrete_powder' | 'blue_concrete_powder' | 'brown_concrete_powder' | 'green_concrete_powder' | 'red_concrete_powder' | 'black_concrete_powder' | 'kelp' | 'kelp_plant' | 'dried_kelp_block' | 'turtle_egg' | 'dead_tube_coral_block' | 'dead_brain_coral_block' | 'dead_bubble_coral_block' | 'dead_fire_coral_block' | 'dead_horn_coral_block' | 'tube_coral_block' | 'brain_coral_block' | 'bubble_coral_block' | 'fire_coral_block' | 'horn_coral_block' | 'dead_tube_coral' | 'dead_brain_coral' | 'dead_bubble_coral' | 'dead_fire_coral' | 'dead_horn_coral' | 'tube_coral' | 'brain_coral' | 'bubble_coral' | 'fire_coral' | 'horn_coral' | 'dead_tube_coral_fan' | 'dead_brain_coral_fan' | 'dead_bubble_coral_fan' | 'dead_fire_coral_fan' | 'dead_horn_coral_fan' | 'tube_coral_fan' | 'brain_coral_fan' | 'bubble_coral_fan' | 'fire_coral_fan' | 'horn_coral_fan' | 'dead_tube_coral_wall_fan' | 'dead_brain_coral_wall_fan' | 'dead_bubble_coral_wall_fan' | 'dead_fire_coral_wall_fan' | 'dead_horn_coral_wall_fan' | 'tube_coral_wall_fan' | 'brain_coral_wall_fan' | 'bubble_coral_wall_fan' | 'fire_coral_wall_fan' | 'horn_coral_wall_fan' | 'sea_pickle' | 'blue_ice' | 'conduit' | 'bamboo_sapling' | 'bamboo' | 'potted_bamboo' | 'void_air' | 'cave_air' | 'bubble_column' | 'polished_granite_stairs' | 'smooth_red_sandstone_stairs' | 'mossy_stone_brick_stairs' | 'polished_diorite_stairs' | 'mossy_cobblestone_stairs' | 'end_stone_brick_stairs' | 'stone_stairs' | 'smooth_sandstone_stairs' | 'smooth_quartz_stairs' | 'granite_stairs' | 'andesite_stairs' | 'red_nether_brick_stairs' | 'polished_andesite_stairs' | 'diorite_stairs' | 'polished_granite_slab' | 'smooth_red_sandstone_slab' | 'mossy_stone_brick_slab' | 'polished_diorite_slab' | 'mossy_cobblestone_slab' | 'end_stone_brick_slab' | 'smooth_sandstone_slab' | 'smooth_quartz_slab' | 'granite_slab' | 'andesite_slab' | 'red_nether_brick_slab' | 'polished_andesite_slab' | 'diorite_slab' | 'brick_wall' | 'prismarine_wall' | 'red_sandstone_wall' | 'mossy_stone_brick_wall' | 'granite_wall' | 'stone_brick_wall' | 'nether_brick_wall' | 'andesite_wall' | 'red_nether_brick_wall' | 'sandstone_wall' | 'end_stone_brick_wall' | 'diorite_wall' | 'scaffolding' | 'loom' | 'barrel' | 'smoker' | 'blast_furnace' | 'cartography_table' | 'fletching_table' | 'grindstone' | 'lectern' | 'smithing_table' | 'stonecutter' | 'bell' | 'lantern' | 'soul_lantern' | 'campfire' | 'soul_campfire' | 'sweet_berry_bush' | 'warped_stem' | 'stripped_warped_stem' | 'warped_hyphae' | 'stripped_warped_hyphae' | 'warped_nylium' | 'warped_fungus' | 'warped_wart_block' | 'warped_roots' | 'nether_sprouts' | 'crimson_stem' | 'stripped_crimson_stem' | 'crimson_hyphae' | 'stripped_crimson_hyphae' | 'crimson_nylium' | 'crimson_fungus' | 'shroomlight' | 'weeping_vines' | 'weeping_vines_plant' | 'twisting_vines' | 'twisting_vines_plant' | 'crimson_roots' | 'crimson_planks' | 'warped_planks' | 'crimson_slab' | 'warped_slab' | 'crimson_pressure_plate' | 'warped_pressure_plate' | 'crimson_fence' | 'warped_fence' | 'crimson_trapdoor' | 'warped_trapdoor' | 'crimson_fence_gate' | 'warped_fence_gate' | 'crimson_stairs' | 'warped_stairs' | 'crimson_button' | 'warped_button' | 'crimson_door' | 'warped_door' | 'crimson_sign' | 'warped_sign' | 'crimson_wall_sign' | 'warped_wall_sign' | 'structure_block' | 'jigsaw' | 'composter' | 'target' | 'bee_nest' | 'beehive' | 'honey_block' | 'honeycomb_block' | 'netherite_block' | 'ancient_debris' | 'crying_obsidian' | 'respawn_anchor' | 'potted_crimson_fungus' | 'potted_warped_fungus' | 'potted_crimson_roots' | 'potted_warped_roots' | 'lodestone' | 'blackstone' | 'blackstone_stairs' | 'blackstone_wall' | 'blackstone_slab' | 'polished_blackstone' | 'polished_blackstone_bricks' | 'cracked_polished_blackstone_bricks' | 'chiseled_polished_blackstone' | 'polished_blackstone_brick_slab' | 'polished_blackstone_brick_stairs' | 'polished_blackstone_brick_wall' | 'gilded_blackstone' | 'polished_blackstone_stairs' | 'polished_blackstone_slab' | 'polished_blackstone_pressure_plate' | 'polished_blackstone_button' | 'polished_blackstone_wall' | 'chiseled_nether_bricks' | 'cracked_nether_bricks' | 'quartz_bricks';

type itemType = 'stone' | 'granite' | 'polished_granite' | 'diorite' | 'polished_diorite' | 'andesite' | 'polished_andesite' | 'grass_block' | 'dirt' | 'coarse_dirt' | 'podzol' | 'crimson_nylium' | 'warped_nylium' | 'cobblestone' | 'oak_planks' | 'spruce_planks' | 'birch_planks' | 'jungle_planks' | 'acacia_planks' | 'dark_oak_planks' | 'crimson_planks' | 'warped_planks' | 'oak_sapling' | 'spruce_sapling' | 'birch_sapling' | 'jungle_sapling' | 'acacia_sapling' | 'dark_oak_sapling' | 'bedrock' | 'sand' | 'red_sand' | 'gravel' | 'gold_ore' | 'iron_ore' | 'coal_ore' | 'nether_gold_ore' | 'oak_log' | 'spruce_log' | 'birch_log' | 'jungle_log' | 'acacia_log' | 'dark_oak_log' | 'crimson_stem' | 'warped_stem' | 'stripped_oak_log' | 'stripped_spruce_log' | 'stripped_birch_log' | 'stripped_jungle_log' | 'stripped_acacia_log' | 'stripped_dark_oak_log' | 'stripped_crimson_stem' | 'stripped_warped_stem' | 'stripped_oak_wood' | 'stripped_spruce_wood' | 'stripped_birch_wood' | 'stripped_jungle_wood' | 'stripped_acacia_wood' | 'stripped_dark_oak_wood' | 'stripped_crimson_hyphae' | 'stripped_warped_hyphae' | 'oak_wood' | 'spruce_wood' | 'birch_wood' | 'jungle_wood' | 'acacia_wood' | 'dark_oak_wood' | 'crimson_hyphae' | 'warped_hyphae' | 'oak_leaves' | 'spruce_leaves' | 'birch_leaves' | 'jungle_leaves' | 'acacia_leaves' | 'dark_oak_leaves' | 'sponge' | 'wet_sponge' | 'glass' | 'lapis_ore' | 'lapis_block' | 'dispenser' | 'sandstone' | 'chiseled_sandstone' | 'cut_sandstone' | 'note_block' | 'powered_rail' | 'detector_rail' | 'sticky_piston' | 'cobweb' | 'grass' | 'fern' | 'dead_bush' | 'seagrass' | 'sea_pickle' | 'piston' | 'white_wool' | 'orange_wool' | 'magenta_wool' | 'light_blue_wool' | 'yellow_wool' | 'lime_wool' | 'pink_wool' | 'gray_wool' | 'light_gray_wool' | 'cyan_wool' | 'purple_wool' | 'blue_wool' | 'brown_wool' | 'green_wool' | 'red_wool' | 'black_wool' | 'dandelion' | 'poppy' | 'blue_orchid' | 'allium' | 'azure_bluet' | 'red_tulip' | 'orange_tulip' | 'white_tulip' | 'pink_tulip' | 'oxeye_daisy' | 'cornflower' | 'lily_of_the_valley' | 'wither_rose' | 'brown_mushroom' | 'red_mushroom' | 'crimson_fungus' | 'warped_fungus' | 'crimson_roots' | 'warped_roots' | 'nether_sprouts' | 'weeping_vines' | 'twisting_vines' | 'sugar_cane' | 'kelp' | 'bamboo' | 'gold_block' | 'iron_block' | 'oak_slab' | 'spruce_slab' | 'birch_slab' | 'jungle_slab' | 'acacia_slab' | 'dark_oak_slab' | 'crimson_slab' | 'warped_slab' | 'stone_slab' | 'smooth_stone_slab' | 'sandstone_slab' | 'cut_sandstone_slab' | 'petrified_oak_slab' | 'cobblestone_slab' | 'brick_slab' | 'stone_brick_slab' | 'nether_brick_slab' | 'quartz_slab' | 'red_sandstone_slab' | 'cut_red_sandstone_slab' | 'purpur_slab' | 'prismarine_slab' | 'prismarine_brick_slab' | 'dark_prismarine_slab' | 'smooth_quartz' | 'smooth_red_sandstone' | 'smooth_sandstone' | 'smooth_stone' | 'bricks' | 'tnt' | 'bookshelf' | 'mossy_cobblestone' | 'obsidian' | 'torch' | 'end_rod' | 'chorus_plant' | 'chorus_flower' | 'purpur_block' | 'purpur_pillar' | 'purpur_stairs' | 'spawner' | 'oak_stairs' | 'chest' | 'diamond_ore' | 'diamond_block' | 'crafting_table' | 'farmland' | 'furnace' | 'ladder' | 'rail' | 'cobblestone_stairs' | 'lever' | 'stone_pressure_plate' | 'oak_pressure_plate' | 'spruce_pressure_plate' | 'birch_pressure_plate' | 'jungle_pressure_plate' | 'acacia_pressure_plate' | 'dark_oak_pressure_plate' | 'crimson_pressure_plate' | 'warped_pressure_plate' | 'polished_blackstone_pressure_plate' | 'redstone_ore' | 'redstone_torch' | 'snow' | 'ice' | 'snow_block' | 'cactus' | 'clay' | 'jukebox' | 'oak_fence' | 'spruce_fence' | 'birch_fence' | 'jungle_fence' | 'acacia_fence' | 'dark_oak_fence' | 'crimson_fence' | 'warped_fence' | 'pumpkin' | 'carved_pumpkin' | 'netherrack' | 'soul_sand' | 'soul_soil' | 'basalt' | 'polished_basalt' | 'soul_torch' | 'glowstone' | 'jack_o_lantern' | 'oak_trapdoor' | 'spruce_trapdoor' | 'birch_trapdoor' | 'jungle_trapdoor' | 'acacia_trapdoor' | 'dark_oak_trapdoor' | 'crimson_trapdoor' | 'warped_trapdoor' | 'infested_stone' | 'infested_cobblestone' | 'infested_stone_bricks' | 'infested_mossy_stone_bricks' | 'infested_cracked_stone_bricks' | 'infested_chiseled_stone_bricks' | 'stone_bricks' | 'mossy_stone_bricks' | 'cracked_stone_bricks' | 'chiseled_stone_bricks' | 'brown_mushroom_block' | 'red_mushroom_block' | 'mushroom_stem' | 'iron_bars' | 'chain' | 'glass_pane' | 'melon' | 'vine' | 'oak_fence_gate' | 'spruce_fence_gate' | 'birch_fence_gate' | 'jungle_fence_gate' | 'acacia_fence_gate' | 'dark_oak_fence_gate' | 'crimson_fence_gate' | 'warped_fence_gate' | 'brick_stairs' | 'stone_brick_stairs' | 'mycelium' | 'lily_pad' | 'nether_bricks' | 'cracked_nether_bricks' | 'chiseled_nether_bricks' | 'nether_brick_fence' | 'nether_brick_stairs' | 'enchanting_table' | 'end_portal_frame' | 'end_stone' | 'end_stone_bricks' | 'dragon_egg' | 'redstone_lamp' | 'sandstone_stairs' | 'emerald_ore' | 'ender_chest' | 'tripwire_hook' | 'emerald_block' | 'spruce_stairs' | 'birch_stairs' | 'jungle_stairs' | 'crimson_stairs' | 'warped_stairs' | 'command_block' | 'beacon' | 'cobblestone_wall' | 'mossy_cobblestone_wall' | 'brick_wall' | 'prismarine_wall' | 'red_sandstone_wall' | 'mossy_stone_brick_wall' | 'granite_wall' | 'stone_brick_wall' | 'nether_brick_wall' | 'andesite_wall' | 'red_nether_brick_wall' | 'sandstone_wall' | 'end_stone_brick_wall' | 'diorite_wall' | 'blackstone_wall' | 'polished_blackstone_wall' | 'polished_blackstone_brick_wall' | 'stone_button' | 'oak_button' | 'spruce_button' | 'birch_button' | 'jungle_button' | 'acacia_button' | 'dark_oak_button' | 'crimson_button' | 'warped_button' | 'polished_blackstone_button' | 'anvil' | 'chipped_anvil' | 'damaged_anvil' | 'trapped_chest' | 'light_weighted_pressure_plate' | 'heavy_weighted_pressure_plate' | 'daylight_detector' | 'redstone_block' | 'nether_quartz_ore' | 'hopper' | 'chiseled_quartz_block' | 'quartz_block' | 'quartz_bricks' | 'quartz_pillar' | 'quartz_stairs' | 'activator_rail' | 'dropper' | 'white_terracotta' | 'orange_terracotta' | 'magenta_terracotta' | 'light_blue_terracotta' | 'yellow_terracotta' | 'lime_terracotta' | 'pink_terracotta' | 'gray_terracotta' | 'light_gray_terracotta' | 'cyan_terracotta' | 'purple_terracotta' | 'blue_terracotta' | 'brown_terracotta' | 'green_terracotta' | 'red_terracotta' | 'black_terracotta' | 'barrier' | 'iron_trapdoor' | 'hay_block' | 'white_carpet' | 'orange_carpet' | 'magenta_carpet' | 'light_blue_carpet' | 'yellow_carpet' | 'lime_carpet' | 'pink_carpet' | 'gray_carpet' | 'light_gray_carpet' | 'cyan_carpet' | 'purple_carpet' | 'blue_carpet' | 'brown_carpet' | 'green_carpet' | 'red_carpet' | 'black_carpet' | 'terracotta' | 'coal_block' | 'packed_ice' | 'acacia_stairs' | 'dark_oak_stairs' | 'slime_block' | 'grass_path' | 'sunflower' | 'lilac' | 'rose_bush' | 'peony' | 'tall_grass' | 'large_fern' | 'white_stained_glass' | 'orange_stained_glass' | 'magenta_stained_glass' | 'light_blue_stained_glass' | 'yellow_stained_glass' | 'lime_stained_glass' | 'pink_stained_glass' | 'gray_stained_glass' | 'light_gray_stained_glass' | 'cyan_stained_glass' | 'purple_stained_glass' | 'blue_stained_glass' | 'brown_stained_glass' | 'green_stained_glass' | 'red_stained_glass' | 'black_stained_glass' | 'white_stained_glass_pane' | 'orange_stained_glass_pane' | 'magenta_stained_glass_pane' | 'light_blue_stained_glass_pane' | 'yellow_stained_glass_pane' | 'lime_stained_glass_pane' | 'pink_stained_glass_pane' | 'gray_stained_glass_pane' | 'light_gray_stained_glass_pane' | 'cyan_stained_glass_pane' | 'purple_stained_glass_pane' | 'blue_stained_glass_pane' | 'brown_stained_glass_pane' | 'green_stained_glass_pane' | 'red_stained_glass_pane' | 'black_stained_glass_pane' | 'prismarine' | 'prismarine_bricks' | 'dark_prismarine' | 'prismarine_stairs' | 'prismarine_brick_stairs' | 'dark_prismarine_stairs' | 'sea_lantern' | 'red_sandstone' | 'chiseled_red_sandstone' | 'cut_red_sandstone' | 'red_sandstone_stairs' | 'repeating_command_block' | 'chain_command_block' | 'magma_block' | 'nether_wart_block' | 'warped_wart_block' | 'red_nether_bricks' | 'bone_block' | 'structure_void' | 'observer' | 'shulker_box' | 'white_shulker_box' | 'orange_shulker_box' | 'magenta_shulker_box' | 'light_blue_shulker_box' | 'yellow_shulker_box' | 'lime_shulker_box' | 'pink_shulker_box' | 'gray_shulker_box' | 'light_gray_shulker_box' | 'cyan_shulker_box' | 'purple_shulker_box' | 'blue_shulker_box' | 'brown_shulker_box' | 'green_shulker_box' | 'red_shulker_box' | 'black_shulker_box' | 'white_glazed_terracotta' | 'orange_glazed_terracotta' | 'magenta_glazed_terracotta' | 'light_blue_glazed_terracotta' | 'yellow_glazed_terracotta' | 'lime_glazed_terracotta' | 'pink_glazed_terracotta' | 'gray_glazed_terracotta' | 'light_gray_glazed_terracotta' | 'cyan_glazed_terracotta' | 'purple_glazed_terracotta' | 'blue_glazed_terracotta' | 'brown_glazed_terracotta' | 'green_glazed_terracotta' | 'red_glazed_terracotta' | 'black_glazed_terracotta' | 'white_concrete' | 'orange_concrete' | 'magenta_concrete' | 'light_blue_concrete' | 'yellow_concrete' | 'lime_concrete' | 'pink_concrete' | 'gray_concrete' | 'light_gray_concrete' | 'cyan_concrete' | 'purple_concrete' | 'blue_concrete' | 'brown_concrete' | 'green_concrete' | 'red_concrete' | 'black_concrete' | 'white_concrete_powder' | 'orange_concrete_powder' | 'magenta_concrete_powder' | 'light_blue_concrete_powder' | 'yellow_concrete_powder' | 'lime_concrete_powder' | 'pink_concrete_powder' | 'gray_concrete_powder' | 'light_gray_concrete_powder' | 'cyan_concrete_powder' | 'purple_concrete_powder' | 'blue_concrete_powder' | 'brown_concrete_powder' | 'green_concrete_powder' | 'red_concrete_powder' | 'black_concrete_powder' | 'turtle_egg' | 'dead_tube_coral_block' | 'dead_brain_coral_block' | 'dead_bubble_coral_block' | 'dead_fire_coral_block' | 'dead_horn_coral_block' | 'tube_coral_block' | 'brain_coral_block' | 'bubble_coral_block' | 'fire_coral_block' | 'horn_coral_block' | 'tube_coral' | 'brain_coral' | 'bubble_coral' | 'fire_coral' | 'horn_coral' | 'dead_brain_coral' | 'dead_bubble_coral' | 'dead_fire_coral' | 'dead_horn_coral' | 'dead_tube_coral' | 'tube_coral_fan' | 'brain_coral_fan' | 'bubble_coral_fan' | 'fire_coral_fan' | 'horn_coral_fan' | 'dead_tube_coral_fan' | 'dead_brain_coral_fan' | 'dead_bubble_coral_fan' | 'dead_fire_coral_fan' | 'dead_horn_coral_fan' | 'blue_ice' | 'conduit' | 'polished_granite_stairs' | 'smooth_red_sandstone_stairs' | 'mossy_stone_brick_stairs' | 'polished_diorite_stairs' | 'mossy_cobblestone_stairs' | 'end_stone_brick_stairs' | 'stone_stairs' | 'smooth_sandstone_stairs' | 'smooth_quartz_stairs' | 'granite_stairs' | 'andesite_stairs' | 'red_nether_brick_stairs' | 'polished_andesite_stairs' | 'diorite_stairs' | 'polished_granite_slab' | 'smooth_red_sandstone_slab' | 'mossy_stone_brick_slab' | 'polished_diorite_slab' | 'mossy_cobblestone_slab' | 'end_stone_brick_slab' | 'smooth_sandstone_slab' | 'smooth_quartz_slab' | 'granite_slab' | 'andesite_slab' | 'red_nether_brick_slab' | 'polished_andesite_slab' | 'diorite_slab' | 'scaffolding' | 'iron_door' | 'oak_door' | 'spruce_door' | 'birch_door' | 'jungle_door' | 'acacia_door' | 'dark_oak_door' | 'crimson_door' | 'warped_door' | 'repeater' | 'comparator' | 'structure_block' | 'jigsaw' | 'turtle_helmet' | 'scute' | 'flint_and_steel' | 'apple' | 'bow' | 'arrow' | 'coal' | 'charcoal' | 'diamond' | 'iron_ingot' | 'gold_ingot' | 'netherite_ingot' | 'netherite_scrap' | 'wooden_sword' | 'wooden_shovel' | 'wooden_pickaxe' | 'wooden_axe' | 'wooden_hoe' | 'stone_sword' | 'stone_shovel' | 'stone_pickaxe' | 'stone_axe' | 'stone_hoe' | 'golden_sword' | 'golden_shovel' | 'golden_pickaxe' | 'golden_axe' | 'golden_hoe' | 'iron_sword' | 'iron_shovel' | 'iron_pickaxe' | 'iron_axe' | 'iron_hoe' | 'diamond_sword' | 'diamond_shovel' | 'diamond_pickaxe' | 'diamond_axe' | 'diamond_hoe' | 'netherite_sword' | 'netherite_shovel' | 'netherite_pickaxe' | 'netherite_axe' | 'netherite_hoe' | 'stick' | 'bowl' | 'mushroom_stew' | 'string' | 'feather' | 'gunpowder' | 'wheat_seeds' | 'wheat' | 'bread' | 'leather_helmet' | 'leather_chestplate' | 'leather_leggings' | 'leather_boots' | 'chainmail_helmet' | 'chainmail_chestplate' | 'chainmail_leggings' | 'chainmail_boots' | 'iron_helmet' | 'iron_chestplate' | 'iron_leggings' | 'iron_boots' | 'diamond_helmet' | 'diamond_chestplate' | 'diamond_leggings' | 'diamond_boots' | 'golden_helmet' | 'golden_chestplate' | 'golden_leggings' | 'golden_boots' | 'netherite_helmet' | 'netherite_chestplate' | 'netherite_leggings' | 'netherite_boots' | 'flint' | 'porkchop' | 'cooked_porkchop' | 'painting' | 'golden_apple' | 'enchanted_golden_apple' | 'oak_sign' | 'spruce_sign' | 'birch_sign' | 'jungle_sign' | 'acacia_sign' | 'dark_oak_sign' | 'crimson_sign' | 'warped_sign' | 'bucket' | 'water_bucket' | 'lava_bucket' | 'minecart' | 'saddle' | 'redstone' | 'snowball' | 'oak_boat' | 'leather' | 'milk_bucket' | 'pufferfish_bucket' | 'salmon_bucket' | 'cod_bucket' | 'tropical_fish_bucket' | 'brick' | 'clay_ball' | 'dried_kelp_block' | 'paper' | 'book' | 'slime_ball' | 'chest_minecart' | 'furnace_minecart' | 'egg' | 'compass' | 'fishing_rod' | 'clock' | 'glowstone_dust' | 'cod' | 'salmon' | 'tropical_fish' | 'pufferfish' | 'cooked_cod' | 'cooked_salmon' | 'ink_sac' | 'cocoa_beans' | 'lapis_lazuli' | 'white_dye' | 'orange_dye' | 'magenta_dye' | 'light_blue_dye' | 'yellow_dye' | 'lime_dye' | 'pink_dye' | 'gray_dye' | 'light_gray_dye' | 'cyan_dye' | 'purple_dye' | 'blue_dye' | 'brown_dye' | 'green_dye' | 'red_dye' | 'black_dye' | 'bone_meal' | 'bone' | 'sugar' | 'cake' | 'white_bed' | 'orange_bed' | 'magenta_bed' | 'light_blue_bed' | 'yellow_bed' | 'lime_bed' | 'pink_bed' | 'gray_bed' | 'light_gray_bed' | 'cyan_bed' | 'purple_bed' | 'blue_bed' | 'brown_bed' | 'green_bed' | 'red_bed' | 'black_bed' | 'cookie' | 'filled_map' | 'shears' | 'melon_slice' | 'dried_kelp' | 'pumpkin_seeds' | 'melon_seeds' | 'beef' | 'cooked_beef' | 'chicken' | 'cooked_chicken' | 'rotten_flesh' | 'ender_pearl' | 'blaze_rod' | 'ghast_tear' | 'gold_nugget' | 'nether_wart' | 'potion' | 'glass_bottle' | 'spider_eye' | 'fermented_spider_eye' | 'blaze_powder' | 'magma_cream' | 'brewing_stand' | 'cauldron' | 'ender_eye' | 'glistering_melon_slice' | 'bat_spawn_egg' | 'bee_spawn_egg' | 'blaze_spawn_egg' | 'cat_spawn_egg' | 'cave_spider_spawn_egg' | 'chicken_spawn_egg' | 'cod_spawn_egg' | 'cow_spawn_egg' | 'creeper_spawn_egg' | 'dolphin_spawn_egg' | 'donkey_spawn_egg' | 'drowned_spawn_egg' | 'elder_guardian_spawn_egg' | 'enderman_spawn_egg' | 'endermite_spawn_egg' | 'evoker_spawn_egg' | 'fox_spawn_egg' | 'ghast_spawn_egg' | 'guardian_spawn_egg' | 'hoglin_spawn_egg' | 'horse_spawn_egg' | 'husk_spawn_egg' | 'llama_spawn_egg' | 'magma_cube_spawn_egg' | 'mooshroom_spawn_egg' | 'mule_spawn_egg' | 'ocelot_spawn_egg' | 'panda_spawn_egg' | 'parrot_spawn_egg' | 'phantom_spawn_egg' | 'pig_spawn_egg' | 'piglin_spawn_egg' | 'piglin_brute_spawn_egg' | 'pillager_spawn_egg' | 'polar_bear_spawn_egg' | 'pufferfish_spawn_egg' | 'rabbit_spawn_egg' | 'ravager_spawn_egg' | 'salmon_spawn_egg' | 'sheep_spawn_egg' | 'shulker_spawn_egg' | 'silverfish_spawn_egg' | 'skeleton_spawn_egg' | 'skeleton_horse_spawn_egg' | 'slime_spawn_egg' | 'spider_spawn_egg' | 'squid_spawn_egg' | 'stray_spawn_egg' | 'strider_spawn_egg' | 'trader_llama_spawn_egg' | 'tropical_fish_spawn_egg' | 'turtle_spawn_egg' | 'vex_spawn_egg' | 'villager_spawn_egg' | 'vindicator_spawn_egg' | 'wandering_trader_spawn_egg' | 'witch_spawn_egg' | 'wither_skeleton_spawn_egg' | 'wolf_spawn_egg' | 'zoglin_spawn_egg' | 'zombie_spawn_egg' | 'zombie_horse_spawn_egg' | 'zombie_villager_spawn_egg' | 'zombified_piglin_spawn_egg' | 'experience_bottle' | 'fire_charge' | 'writable_book' | 'written_book' | 'emerald' | 'item_frame' | 'flower_pot' | 'carrot' | 'potato' | 'baked_potato' | 'poisonous_potato' | 'map' | 'golden_carrot' | 'skeleton_skull' | 'wither_skeleton_skull' | 'player_head' | 'zombie_head' | 'creeper_head' | 'dragon_head' | 'carrot_on_a_stick' | 'warped_fungus_on_a_stick' | 'nether_star' | 'pumpkin_pie' | 'firework_rocket' | 'firework_star' | 'enchanted_book' | 'nether_brick' | 'quartz' | 'tnt_minecart' | 'hopper_minecart' | 'prismarine_shard' | 'prismarine_crystals' | 'rabbit' | 'cooked_rabbit' | 'rabbit_stew' | 'rabbit_foot' | 'rabbit_hide' | 'armor_stand' | 'iron_horse_armor' | 'golden_horse_armor' | 'diamond_horse_armor' | 'leather_horse_armor' | 'lead' | 'name_tag' | 'command_block_minecart' | 'mutton' | 'cooked_mutton' | 'white_banner' | 'orange_banner' | 'magenta_banner' | 'light_blue_banner' | 'yellow_banner' | 'lime_banner' | 'pink_banner' | 'gray_banner' | 'light_gray_banner' | 'cyan_banner' | 'purple_banner' | 'blue_banner' | 'brown_banner' | 'green_banner' | 'red_banner' | 'black_banner' | 'end_crystal' | 'chorus_fruit' | 'popped_chorus_fruit' | 'beetroot' | 'beetroot_seeds' | 'beetroot_soup' | 'dragon_breath' | 'splash_potion' | 'spectral_arrow' | 'tipped_arrow' | 'lingering_potion' | 'shield' | 'elytra' | 'spruce_boat' | 'birch_boat' | 'jungle_boat' | 'acacia_boat' | 'dark_oak_boat' | 'totem_of_undying' | 'shulker_shell' | 'iron_nugget' | 'knowledge_book' | 'debug_stick' | 'music_disc_13' | 'music_disc_cat' | 'music_disc_blocks' | 'music_disc_chirp' | 'music_disc_far' | 'music_disc_mall' | 'music_disc_mellohi' | 'music_disc_stal' | 'music_disc_strad' | 'music_disc_ward' | 'music_disc_11' | 'music_disc_wait' | 'music_disc_pigstep' | 'trident' | 'phantom_membrane' | 'nautilus_shell' | 'heart_of_the_sea' | 'crossbow' | 'suspicious_stew' | 'loom' | 'flower_banner_pattern' | 'creeper_banner_pattern' | 'skull_banner_pattern' | 'mojang_banner_pattern' | 'globe_banner_pattern' | 'piglin_banner_pattern' | 'composter' | 'barrel' | 'smoker' | 'blast_furnace' | 'cartography_table' | 'fletching_table' | 'grindstone' | 'lectern' | 'smithing_table' | 'stonecutter' | 'bell' | 'lantern' | 'soul_lantern' | 'sweet_berries' | 'campfire' | 'soul_campfire' | 'shroomlight' | 'honeycomb' | 'bee_nest' | 'beehive' | 'honey_bottle' | 'honey_block' | 'honeycomb_block' | 'lodestone' | 'netherite_block' | 'ancient_debris' | 'target' | 'crying_obsidian' | 'blackstone' | 'blackstone_slab' | 'blackstone_stairs' | 'gilded_blackstone' | 'polished_blackstone' | 'polished_blackstone_slab' | 'polished_blackstone_stairs' | 'chiseled_polished_blackstone' | 'polished_blackstone_bricks' | 'polished_blackstone_brick_slab' | 'polished_blackstone_brick_stairs' | 'cracked_polished_blackstone_bricks' | 'respawn_anchor';

