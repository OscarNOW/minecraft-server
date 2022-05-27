import { EventEmitter } from 'events';

type Entity = import('./Entity').Entity;
type Text = import('../exports/Text').Text;
type Server = import('../exports/Server').Server;
type Chunk = import('../exports/Chunk').Chunk;
type Color = import('../exports/Color').Color;

export class Client extends EventEmitter {
    private constructor(client: any, server: Server, version: version);

    readonly server: Server;
    readonly username: string;
    readonly uuid: string;
    readonly entityId: number;
    readonly ping: number;
    readonly online: boolean;
    readonly version: version;
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

    darkSky: boolean;
    respawnScreen: boolean;
    gamemode: 'survival' | 'creative' | 'adventure' | 'spectator';

    health: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
    food: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
    foodSaturation: 0 | 1 | 2 | 3 | 4 | 5;

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
        color: Color | {
            red: number;
            green: number;
            blue: number;
        },
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
    cooldown(item: itemType, length?: number): void;
    demo(message: 'startScreen' | 'movement' | 'jump' | 'inventory' | 'endScreenshot'): void;
    elderGuardian(): void;
    win(hideCredits: boolean): void;
    kick(reason: string | Text): void;
    chat(message: string | Text): void;
    title(properties: {
        fadeIn?: number;
        stay: number;
        fadeOut?: number;
        title?: string;
        subTitle?: string;
    }): void;
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
    difficulty(difficulty: 'peaceful' | 'easy' | 'normal' | 'hard'): void;
    window(windowType: windowType): void;
    window(windowType: 'horse', horse: Entity): void;

    on(event: 'chat', callback: (message: string) => void): void;
    on(event: 'move' | 'leave' | 'slotChange' | 'itemHandSwap', callback: () => void): void;
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
    once(event: 'move' | 'leave' | 'slotChange' | 'itemHandSwap', callback: () => void): void;
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
    addListener(event: 'move' | 'leave' | 'slotChange' | 'itemHandSwap', callback: () => void): void;
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
    prependListener(event: 'move' | 'leave' | 'slotChange' | 'itemHandSwap', callback: () => void): void;
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
    prependOnceListener(event: 'move' | 'leave' | 'slotChange' | 'itemHandSwap', callback: () => void): void;
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
    off(event: 'move' | 'leave' | 'slotChange' | 'itemHandSwap', callback: () => void): void;
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
    removeListener(event: 'move' | 'leave' | 'slotChange' | 'itemHandSwap', callback: () => void): void;
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

    removeAllListeners(event?: 'chat' | 'move' | 'leave' | 'slotChange' | 'itemHandSwap' | 'digStart' | 'digCancel' | 'blockBreak' | 'itemDrop'): void;
    rawListeners(event: 'chat' | 'move' | 'leave' | 'slotChange' | 'itemHandSwap' | 'digStart' | 'digCancel' | 'blockBreak' | 'itemDrop'): void;
}

type blockType = 'air' | 'stone' | 'granite' | 'polished_granite' | 'diorite' | 'polished_diorite' | 'andesite' | 'polished_andesite' | 'grass_block' | 'dirt' | 'coarse_dirt' | 'podzol' | 'cobblestone' | 'oak_planks' | 'spruce_planks' | 'birch_planks' | 'jungle_planks' | 'acacia_planks' | 'dark_oak_planks' | 'oak_sapling' | 'spruce_sapling' | 'birch_sapling' | 'jungle_sapling' | 'acacia_sapling' | 'dark_oak_sapling' | 'bedrock' | 'water' | 'lava' | 'sand' | 'red_sand' | 'gravel' | 'gold_ore' | 'iron_ore' | 'coal_ore' | 'nether_gold_ore' | 'oak_log' | 'spruce_log' | 'birch_log' | 'jungle_log' | 'acacia_log' | 'dark_oak_log' | 'stripped_spruce_log' | 'stripped_birch_log' | 'stripped_jungle_log' | 'stripped_acacia_log' | 'stripped_dark_oak_log' | 'stripped_oak_log' | 'oak_wood' | 'spruce_wood' | 'birch_wood' | 'jungle_wood' | 'acacia_wood' | 'dark_oak_wood' | 'stripped_oak_wood' | 'stripped_spruce_wood' | 'stripped_birch_wood' | 'stripped_jungle_wood' | 'stripped_acacia_wood' | 'stripped_dark_oak_wood' | 'oak_leaves' | 'spruce_leaves' | 'birch_leaves' | 'jungle_leaves' | 'acacia_leaves' | 'dark_oak_leaves' | 'sponge' | 'wet_sponge' | 'glass' | 'lapis_ore' | 'lapis_block' | 'dispenser' | 'sandstone' | 'chiseled_sandstone' | 'cut_sandstone' | 'note_block' | 'white_bed' | 'orange_bed' | 'magenta_bed' | 'light_blue_bed' | 'yellow_bed' | 'lime_bed' | 'pink_bed' | 'gray_bed' | 'light_gray_bed' | 'cyan_bed' | 'purple_bed' | 'blue_bed' | 'brown_bed' | 'green_bed' | 'red_bed' | 'black_bed' | 'powered_rail' | 'detector_rail' | 'sticky_piston' | 'cobweb' | 'grass' | 'fern' | 'dead_bush' | 'seagrass' | 'tall_seagrass' | 'piston' | 'piston_head' | 'white_wool' | 'orange_wool' | 'magenta_wool' | 'light_blue_wool' | 'yellow_wool' | 'lime_wool' | 'pink_wool' | 'gray_wool' | 'light_gray_wool' | 'cyan_wool' | 'purple_wool' | 'blue_wool' | 'brown_wool' | 'green_wool' | 'red_wool' | 'black_wool' | 'moving_piston' | 'dandelion' | 'poppy' | 'blue_orchid' | 'allium' | 'azure_bluet' | 'red_tulip' | 'orange_tulip' | 'white_tulip' | 'pink_tulip' | 'oxeye_daisy' | 'cornflower' | 'wither_rose' | 'lily_of_the_valley' | 'brown_mushroom' | 'red_mushroom' | 'gold_block' | 'iron_block' | 'bricks' | 'tnt' | 'bookshelf' | 'mossy_cobblestone' | 'obsidian' | 'torch' | 'wall_torch' | 'fire' | 'soul_fire' | 'spawner' | 'oak_stairs' | 'chest' | 'redstone_wire' | 'diamond_ore' | 'diamond_block' | 'crafting_table' | 'wheat' | 'farmland' | 'furnace' | 'oak_sign' | 'spruce_sign' | 'birch_sign' | 'acacia_sign' | 'jungle_sign' | 'dark_oak_sign' | 'oak_door' | 'ladder' | 'rail' | 'cobblestone_stairs' | 'oak_wall_sign' | 'spruce_wall_sign' | 'birch_wall_sign' | 'acacia_wall_sign' | 'jungle_wall_sign' | 'dark_oak_wall_sign' | 'lever' | 'stone_pressure_plate' | 'iron_door' | 'oak_pressure_plate' | 'spruce_pressure_plate' | 'birch_pressure_plate' | 'jungle_pressure_plate' | 'acacia_pressure_plate' | 'dark_oak_pressure_plate' | 'redstone_ore' | 'redstone_torch' | 'redstone_wall_torch' | 'stone_button' | 'snow' | 'ice' | 'snow_block' | 'cactus' | 'clay' | 'sugar_cane' | 'jukebox' | 'oak_fence' | 'pumpkin' | 'netherrack' | 'soul_sand' | 'soul_soil' | 'basalt' | 'polished_basalt' | 'soul_torch' | 'soul_wall_torch' | 'glowstone' | 'nether_portal' | 'carved_pumpkin' | 'jack_o_lantern' | 'cake' | 'repeater' | 'white_stained_glass' | 'orange_stained_glass' | 'magenta_stained_glass' | 'light_blue_stained_glass' | 'yellow_stained_glass' | 'lime_stained_glass' | 'pink_stained_glass' | 'gray_stained_glass' | 'light_gray_stained_glass' | 'cyan_stained_glass' | 'purple_stained_glass' | 'blue_stained_glass' | 'brown_stained_glass' | 'green_stained_glass' | 'red_stained_glass' | 'black_stained_glass' | 'oak_trapdoor' | 'spruce_trapdoor' | 'birch_trapdoor' | 'jungle_trapdoor' | 'acacia_trapdoor' | 'dark_oak_trapdoor' | 'stone_bricks' | 'mossy_stone_bricks' | 'cracked_stone_bricks' | 'chiseled_stone_bricks' | 'infested_stone' | 'infested_cobblestone' | 'infested_stone_bricks' | 'infested_mossy_stone_bricks' | 'infested_cracked_stone_bricks' | 'infested_chiseled_stone_bricks' | 'brown_mushroom_block' | 'red_mushroom_block' | 'mushroom_stem' | 'iron_bars' | 'chain' | 'glass_pane' | 'melon' | 'attached_pumpkin_stem' | 'attached_melon_stem' | 'pumpkin_stem' | 'melon_stem' | 'vine' | 'oak_fence_gate' | 'brick_stairs' | 'stone_brick_stairs' | 'mycelium' | 'lily_pad' | 'nether_bricks' | 'nether_brick_fence' | 'nether_brick_stairs' | 'nether_wart' | 'enchanting_table' | 'brewing_stand' | 'cauldron' | 'end_portal' | 'end_portal_frame' | 'end_stone' | 'dragon_egg' | 'redstone_lamp' | 'cocoa' | 'sandstone_stairs' | 'emerald_ore' | 'ender_chest' | 'tripwire_hook' | 'tripwire' | 'emerald_block' | 'spruce_stairs' | 'birch_stairs' | 'jungle_stairs' | 'command_block' | 'beacon' | 'cobblestone_wall' | 'mossy_cobblestone_wall' | 'flower_pot' | 'potted_oak_sapling' | 'potted_spruce_sapling' | 'potted_birch_sapling' | 'potted_jungle_sapling' | 'potted_acacia_sapling' | 'potted_dark_oak_sapling' | 'potted_fern' | 'potted_dandelion' | 'potted_poppy' | 'potted_blue_orchid' | 'potted_allium' | 'potted_azure_bluet' | 'potted_red_tulip' | 'potted_orange_tulip' | 'potted_white_tulip' | 'potted_pink_tulip' | 'potted_oxeye_daisy' | 'potted_cornflower' | 'potted_lily_of_the_valley' | 'potted_wither_rose' | 'potted_red_mushroom' | 'potted_brown_mushroom' | 'potted_dead_bush' | 'potted_cactus' | 'carrots' | 'potatoes' | 'oak_button' | 'spruce_button' | 'birch_button' | 'jungle_button' | 'acacia_button' | 'dark_oak_button' | 'skeleton_skull' | 'skeleton_wall_skull' | 'wither_skeleton_skull' | 'wither_skeleton_wall_skull' | 'zombie_head' | 'zombie_wall_head' | 'player_head' | 'player_wall_head' | 'creeper_head' | 'creeper_wall_head' | 'dragon_head' | 'dragon_wall_head' | 'anvil' | 'chipped_anvil' | 'damaged_anvil' | 'trapped_chest' | 'light_weighted_pressure_plate' | 'heavy_weighted_pressure_plate' | 'comparator' | 'daylight_detector' | 'redstone_block' | 'nether_quartz_ore' | 'hopper' | 'quartz_block' | 'chiseled_quartz_block' | 'quartz_pillar' | 'quartz_stairs' | 'activator_rail' | 'dropper' | 'white_terracotta' | 'orange_terracotta' | 'magenta_terracotta' | 'light_blue_terracotta' | 'yellow_terracotta' | 'lime_terracotta' | 'pink_terracotta' | 'gray_terracotta' | 'light_gray_terracotta' | 'cyan_terracotta' | 'purple_terracotta' | 'blue_terracotta' | 'brown_terracotta' | 'green_terracotta' | 'red_terracotta' | 'black_terracotta' | 'white_stained_glass_pane' | 'orange_stained_glass_pane' | 'magenta_stained_glass_pane' | 'light_blue_stained_glass_pane' | 'yellow_stained_glass_pane' | 'lime_stained_glass_pane' | 'pink_stained_glass_pane' | 'gray_stained_glass_pane' | 'light_gray_stained_glass_pane' | 'cyan_stained_glass_pane' | 'purple_stained_glass_pane' | 'blue_stained_glass_pane' | 'brown_stained_glass_pane' | 'green_stained_glass_pane' | 'red_stained_glass_pane' | 'black_stained_glass_pane' | 'acacia_stairs' | 'dark_oak_stairs' | 'slime_block' | 'barrier' | 'iron_trapdoor' | 'prismarine' | 'prismarine_bricks' | 'dark_prismarine' | 'prismarine_stairs' | 'prismarine_brick_stairs' | 'dark_prismarine_stairs' | 'prismarine_slab' | 'prismarine_brick_slab' | 'dark_prismarine_slab' | 'sea_lantern' | 'hay_block' | 'white_carpet' | 'orange_carpet' | 'magenta_carpet' | 'light_blue_carpet' | 'yellow_carpet' | 'lime_carpet' | 'pink_carpet' | 'gray_carpet' | 'light_gray_carpet' | 'cyan_carpet' | 'purple_carpet' | 'blue_carpet' | 'brown_carpet' | 'green_carpet' | 'red_carpet' | 'black_carpet' | 'terracotta' | 'coal_block' | 'packed_ice' | 'sunflower' | 'lilac' | 'rose_bush' | 'peony' | 'tall_grass' | 'large_fern' | 'white_banner' | 'orange_banner' | 'magenta_banner' | 'light_blue_banner' | 'yellow_banner' | 'lime_banner' | 'pink_banner' | 'gray_banner' | 'light_gray_banner' | 'cyan_banner' | 'purple_banner' | 'blue_banner' | 'brown_banner' | 'green_banner' | 'red_banner' | 'black_banner' | 'white_wall_banner' | 'orange_wall_banner' | 'magenta_wall_banner' | 'light_blue_wall_banner' | 'yellow_wall_banner' | 'lime_wall_banner' | 'pink_wall_banner' | 'gray_wall_banner' | 'light_gray_wall_banner' | 'cyan_wall_banner' | 'purple_wall_banner' | 'blue_wall_banner' | 'brown_wall_banner' | 'green_wall_banner' | 'red_wall_banner' | 'black_wall_banner' | 'red_sandstone' | 'chiseled_red_sandstone' | 'cut_red_sandstone' | 'red_sandstone_stairs' | 'oak_slab' | 'spruce_slab' | 'birch_slab' | 'jungle_slab' | 'acacia_slab' | 'dark_oak_slab' | 'stone_slab' | 'smooth_stone_slab' | 'sandstone_slab' | 'cut_sandstone_slab' | 'petrified_oak_slab' | 'cobblestone_slab' | 'brick_slab' | 'stone_brick_slab' | 'nether_brick_slab' | 'quartz_slab' | 'red_sandstone_slab' | 'cut_red_sandstone_slab' | 'purpur_slab' | 'smooth_stone' | 'smooth_sandstone' | 'smooth_quartz' | 'smooth_red_sandstone' | 'spruce_fence_gate' | 'birch_fence_gate' | 'jungle_fence_gate' | 'acacia_fence_gate' | 'dark_oak_fence_gate' | 'spruce_fence' | 'birch_fence' | 'jungle_fence' | 'acacia_fence' | 'dark_oak_fence' | 'spruce_door' | 'birch_door' | 'jungle_door' | 'acacia_door' | 'dark_oak_door' | 'end_rod' | 'chorus_plant' | 'chorus_flower' | 'purpur_block' | 'purpur_pillar' | 'purpur_stairs' | 'end_stone_bricks' | 'beetroots' | 'grass_path' | 'end_gateway' | 'repeating_command_block' | 'chain_command_block' | 'frosted_ice' | 'magma_block' | 'nether_wart_block' | 'red_nether_bricks' | 'bone_block' | 'structure_void' | 'observer' | 'shulker_box' | 'white_shulker_box' | 'orange_shulker_box' | 'magenta_shulker_box' | 'light_blue_shulker_box' | 'yellow_shulker_box' | 'lime_shulker_box' | 'pink_shulker_box' | 'gray_shulker_box' | 'light_gray_shulker_box' | 'cyan_shulker_box' | 'purple_shulker_box' | 'blue_shulker_box' | 'brown_shulker_box' | 'green_shulker_box' | 'red_shulker_box' | 'black_shulker_box' | 'white_glazed_terracotta' | 'orange_glazed_terracotta' | 'magenta_glazed_terracotta' | 'light_blue_glazed_terracotta' | 'yellow_glazed_terracotta' | 'lime_glazed_terracotta' | 'pink_glazed_terracotta' | 'gray_glazed_terracotta' | 'light_gray_glazed_terracotta' | 'cyan_glazed_terracotta' | 'purple_glazed_terracotta' | 'blue_glazed_terracotta' | 'brown_glazed_terracotta' | 'green_glazed_terracotta' | 'red_glazed_terracotta' | 'black_glazed_terracotta' | 'white_concrete' | 'orange_concrete' | 'magenta_concrete' | 'light_blue_concrete' | 'yellow_concrete' | 'lime_concrete' | 'pink_concrete' | 'gray_concrete' | 'light_gray_concrete' | 'cyan_concrete' | 'purple_concrete' | 'blue_concrete' | 'brown_concrete' | 'green_concrete' | 'red_concrete' | 'black_concrete' | 'white_concrete_powder' | 'orange_concrete_powder' | 'magenta_concrete_powder' | 'light_blue_concrete_powder' | 'yellow_concrete_powder' | 'lime_concrete_powder' | 'pink_concrete_powder' | 'gray_concrete_powder' | 'light_gray_concrete_powder' | 'cyan_concrete_powder' | 'purple_concrete_powder' | 'blue_concrete_powder' | 'brown_concrete_powder' | 'green_concrete_powder' | 'red_concrete_powder' | 'black_concrete_powder' | 'kelp' | 'kelp_plant' | 'dried_kelp_block' | 'turtle_egg' | 'dead_tube_coral_block' | 'dead_brain_coral_block' | 'dead_bubble_coral_block' | 'dead_fire_coral_block' | 'dead_horn_coral_block' | 'tube_coral_block' | 'brain_coral_block' | 'bubble_coral_block' | 'fire_coral_block' | 'horn_coral_block' | 'dead_tube_coral' | 'dead_brain_coral' | 'dead_bubble_coral' | 'dead_fire_coral' | 'dead_horn_coral' | 'tube_coral' | 'brain_coral' | 'bubble_coral' | 'fire_coral' | 'horn_coral' | 'dead_tube_coral_fan' | 'dead_brain_coral_fan' | 'dead_bubble_coral_fan' | 'dead_fire_coral_fan' | 'dead_horn_coral_fan' | 'tube_coral_fan' | 'brain_coral_fan' | 'bubble_coral_fan' | 'fire_coral_fan' | 'horn_coral_fan' | 'dead_tube_coral_wall_fan' | 'dead_brain_coral_wall_fan' | 'dead_bubble_coral_wall_fan' | 'dead_fire_coral_wall_fan' | 'dead_horn_coral_wall_fan' | 'tube_coral_wall_fan' | 'brain_coral_wall_fan' | 'bubble_coral_wall_fan' | 'fire_coral_wall_fan' | 'horn_coral_wall_fan' | 'sea_pickle' | 'blue_ice' | 'conduit' | 'bamboo_sapling' | 'bamboo' | 'potted_bamboo' | 'void_air' | 'cave_air' | 'bubble_column' | 'polished_granite_stairs' | 'smooth_red_sandstone_stairs' | 'mossy_stone_brick_stairs' | 'polished_diorite_stairs' | 'mossy_cobblestone_stairs' | 'end_stone_brick_stairs' | 'stone_stairs' | 'smooth_sandstone_stairs' | 'smooth_quartz_stairs' | 'granite_stairs' | 'andesite_stairs' | 'red_nether_brick_stairs' | 'polished_andesite_stairs' | 'diorite_stairs' | 'polished_granite_slab' | 'smooth_red_sandstone_slab' | 'mossy_stone_brick_slab' | 'polished_diorite_slab' | 'mossy_cobblestone_slab' | 'end_stone_brick_slab' | 'smooth_sandstone_slab' | 'smooth_quartz_slab' | 'granite_slab' | 'andesite_slab' | 'red_nether_brick_slab' | 'polished_andesite_slab' | 'diorite_slab' | 'brick_wall' | 'prismarine_wall' | 'red_sandstone_wall' | 'mossy_stone_brick_wall' | 'granite_wall' | 'stone_brick_wall' | 'nether_brick_wall' | 'andesite_wall' | 'red_nether_brick_wall' | 'sandstone_wall' | 'end_stone_brick_wall' | 'diorite_wall' | 'scaffolding' | 'loom' | 'barrel' | 'smoker' | 'blast_furnace' | 'cartography_table' | 'fletching_table' | 'grindstone' | 'lectern' | 'smithing_table' | 'stonecutter' | 'bell' | 'lantern' | 'soul_lantern' | 'campfire' | 'soul_campfire' | 'sweet_berry_bush' | 'warped_stem' | 'stripped_warped_stem' | 'warped_hyphae' | 'stripped_warped_hyphae' | 'warped_nylium' | 'warped_fungus' | 'warped_wart_block' | 'warped_roots' | 'nether_sprouts' | 'crimson_stem' | 'stripped_crimson_stem' | 'crimson_hyphae' | 'stripped_crimson_hyphae' | 'crimson_nylium' | 'crimson_fungus' | 'shroomlight' | 'weeping_vines' | 'weeping_vines_plant' | 'twisting_vines' | 'twisting_vines_plant' | 'crimson_roots' | 'crimson_planks' | 'warped_planks' | 'crimson_slab' | 'warped_slab' | 'crimson_pressure_plate' | 'warped_pressure_plate' | 'crimson_fence' | 'warped_fence' | 'crimson_trapdoor' | 'warped_trapdoor' | 'crimson_fence_gate' | 'warped_fence_gate' | 'crimson_stairs' | 'warped_stairs' | 'crimson_button' | 'warped_button' | 'crimson_door' | 'warped_door' | 'crimson_sign' | 'warped_sign' | 'crimson_wall_sign' | 'warped_wall_sign' | 'structure_block' | 'jigsaw' | 'composter' | 'target' | 'bee_nest' | 'beehive' | 'honey_block' | 'honeycomb_block' | 'netherite_block' | 'ancient_debris' | 'crying_obsidian' | 'respawn_anchor' | 'potted_crimson_fungus' | 'potted_warped_fungus' | 'potted_crimson_roots' | 'potted_warped_roots' | 'lodestone' | 'blackstone' | 'blackstone_stairs' | 'blackstone_wall' | 'blackstone_slab' | 'polished_blackstone' | 'polished_blackstone_bricks' | 'cracked_polished_blackstone_bricks' | 'chiseled_polished_blackstone' | 'polished_blackstone_brick_slab' | 'polished_blackstone_brick_stairs' | 'polished_blackstone_brick_wall' | 'gilded_blackstone' | 'polished_blackstone_stairs' | 'polished_blackstone_slab' | 'polished_blackstone_pressure_plate' | 'polished_blackstone_button' | 'polished_blackstone_wall' | 'chiseled_nether_bricks' | 'cracked_nether_bricks' | 'quartz_bricks';

type itemType = 'stone' | 'granite' | 'polished_granite' | 'diorite' | 'polished_diorite' | 'andesite' | 'polished_andesite' | 'grass_block' | 'dirt' | 'coarse_dirt' | 'podzol' | 'crimson_nylium' | 'warped_nylium' | 'cobblestone' | 'oak_planks' | 'spruce_planks' | 'birch_planks' | 'jungle_planks' | 'acacia_planks' | 'dark_oak_planks' | 'crimson_planks' | 'warped_planks' | 'oak_sapling' | 'spruce_sapling' | 'birch_sapling' | 'jungle_sapling' | 'acacia_sapling' | 'dark_oak_sapling' | 'bedrock' | 'sand' | 'red_sand' | 'gravel' | 'gold_ore' | 'iron_ore' | 'coal_ore' | 'nether_gold_ore' | 'oak_log' | 'spruce_log' | 'birch_log' | 'jungle_log' | 'acacia_log' | 'dark_oak_log' | 'crimson_stem' | 'warped_stem' | 'stripped_oak_log' | 'stripped_spruce_log' | 'stripped_birch_log' | 'stripped_jungle_log' | 'stripped_acacia_log' | 'stripped_dark_oak_log' | 'stripped_crimson_stem' | 'stripped_warped_stem' | 'stripped_oak_wood' | 'stripped_spruce_wood' | 'stripped_birch_wood' | 'stripped_jungle_wood' | 'stripped_acacia_wood' | 'stripped_dark_oak_wood' | 'stripped_crimson_hyphae' | 'stripped_warped_hyphae' | 'oak_wood' | 'spruce_wood' | 'birch_wood' | 'jungle_wood' | 'acacia_wood' | 'dark_oak_wood' | 'crimson_hyphae' | 'warped_hyphae' | 'oak_leaves' | 'spruce_leaves' | 'birch_leaves' | 'jungle_leaves' | 'acacia_leaves' | 'dark_oak_leaves' | 'sponge' | 'wet_sponge' | 'glass' | 'lapis_ore' | 'lapis_block' | 'dispenser' | 'sandstone' | 'chiseled_sandstone' | 'cut_sandstone' | 'note_block' | 'powered_rail' | 'detector_rail' | 'sticky_piston' | 'cobweb' | 'grass' | 'fern' | 'dead_bush' | 'seagrass' | 'sea_pickle' | 'piston' | 'white_wool' | 'orange_wool' | 'magenta_wool' | 'light_blue_wool' | 'yellow_wool' | 'lime_wool' | 'pink_wool' | 'gray_wool' | 'light_gray_wool' | 'cyan_wool' | 'purple_wool' | 'blue_wool' | 'brown_wool' | 'green_wool' | 'red_wool' | 'black_wool' | 'dandelion' | 'poppy' | 'blue_orchid' | 'allium' | 'azure_bluet' | 'red_tulip' | 'orange_tulip' | 'white_tulip' | 'pink_tulip' | 'oxeye_daisy' | 'cornflower' | 'lily_of_the_valley' | 'wither_rose' | 'brown_mushroom' | 'red_mushroom' | 'crimson_fungus' | 'warped_fungus' | 'crimson_roots' | 'warped_roots' | 'nether_sprouts' | 'weeping_vines' | 'twisting_vines' | 'sugar_cane' | 'kelp' | 'bamboo' | 'gold_block' | 'iron_block' | 'oak_slab' | 'spruce_slab' | 'birch_slab' | 'jungle_slab' | 'acacia_slab' | 'dark_oak_slab' | 'crimson_slab' | 'warped_slab' | 'stone_slab' | 'smooth_stone_slab' | 'sandstone_slab' | 'cut_sandstone_slab' | 'petrified_oak_slab' | 'cobblestone_slab' | 'brick_slab' | 'stone_brick_slab' | 'nether_brick_slab' | 'quartz_slab' | 'red_sandstone_slab' | 'cut_red_sandstone_slab' | 'purpur_slab' | 'prismarine_slab' | 'prismarine_brick_slab' | 'dark_prismarine_slab' | 'smooth_quartz' | 'smooth_red_sandstone' | 'smooth_sandstone' | 'smooth_stone' | 'bricks' | 'tnt' | 'bookshelf' | 'mossy_cobblestone' | 'obsidian' | 'torch' | 'end_rod' | 'chorus_plant' | 'chorus_flower' | 'purpur_block' | 'purpur_pillar' | 'purpur_stairs' | 'spawner' | 'oak_stairs' | 'chest' | 'diamond_ore' | 'diamond_block' | 'crafting_table' | 'farmland' | 'furnace' | 'ladder' | 'rail' | 'cobblestone_stairs' | 'lever' | 'stone_pressure_plate' | 'oak_pressure_plate' | 'spruce_pressure_plate' | 'birch_pressure_plate' | 'jungle_pressure_plate' | 'acacia_pressure_plate' | 'dark_oak_pressure_plate' | 'crimson_pressure_plate' | 'warped_pressure_plate' | 'polished_blackstone_pressure_plate' | 'redstone_ore' | 'redstone_torch' | 'snow' | 'ice' | 'snow_block' | 'cactus' | 'clay' | 'jukebox' | 'oak_fence' | 'spruce_fence' | 'birch_fence' | 'jungle_fence' | 'acacia_fence' | 'dark_oak_fence' | 'crimson_fence' | 'warped_fence' | 'pumpkin' | 'carved_pumpkin' | 'netherrack' | 'soul_sand' | 'soul_soil' | 'basalt' | 'polished_basalt' | 'soul_torch' | 'glowstone' | 'jack_o_lantern' | 'oak_trapdoor' | 'spruce_trapdoor' | 'birch_trapdoor' | 'jungle_trapdoor' | 'acacia_trapdoor' | 'dark_oak_trapdoor' | 'crimson_trapdoor' | 'warped_trapdoor' | 'infested_stone' | 'infested_cobblestone' | 'infested_stone_bricks' | 'infested_mossy_stone_bricks' | 'infested_cracked_stone_bricks' | 'infested_chiseled_stone_bricks' | 'stone_bricks' | 'mossy_stone_bricks' | 'cracked_stone_bricks' | 'chiseled_stone_bricks' | 'brown_mushroom_block' | 'red_mushroom_block' | 'mushroom_stem' | 'iron_bars' | 'chain' | 'glass_pane' | 'melon' | 'vine' | 'oak_fence_gate' | 'spruce_fence_gate' | 'birch_fence_gate' | 'jungle_fence_gate' | 'acacia_fence_gate' | 'dark_oak_fence_gate' | 'crimson_fence_gate' | 'warped_fence_gate' | 'brick_stairs' | 'stone_brick_stairs' | 'mycelium' | 'lily_pad' | 'nether_bricks' | 'cracked_nether_bricks' | 'chiseled_nether_bricks' | 'nether_brick_fence' | 'nether_brick_stairs' | 'enchanting_table' | 'end_portal_frame' | 'end_stone' | 'end_stone_bricks' | 'dragon_egg' | 'redstone_lamp' | 'sandstone_stairs' | 'emerald_ore' | 'ender_chest' | 'tripwire_hook' | 'emerald_block' | 'spruce_stairs' | 'birch_stairs' | 'jungle_stairs' | 'crimson_stairs' | 'warped_stairs' | 'command_block' | 'beacon' | 'cobblestone_wall' | 'mossy_cobblestone_wall' | 'brick_wall' | 'prismarine_wall' | 'red_sandstone_wall' | 'mossy_stone_brick_wall' | 'granite_wall' | 'stone_brick_wall' | 'nether_brick_wall' | 'andesite_wall' | 'red_nether_brick_wall' | 'sandstone_wall' | 'end_stone_brick_wall' | 'diorite_wall' | 'blackstone_wall' | 'polished_blackstone_wall' | 'polished_blackstone_brick_wall' | 'stone_button' | 'oak_button' | 'spruce_button' | 'birch_button' | 'jungle_button' | 'acacia_button' | 'dark_oak_button' | 'crimson_button' | 'warped_button' | 'polished_blackstone_button' | 'anvil' | 'chipped_anvil' | 'damaged_anvil' | 'trapped_chest' | 'light_weighted_pressure_plate' | 'heavy_weighted_pressure_plate' | 'daylight_detector' | 'redstone_block' | 'nether_quartz_ore' | 'hopper' | 'chiseled_quartz_block' | 'quartz_block' | 'quartz_bricks' | 'quartz_pillar' | 'quartz_stairs' | 'activator_rail' | 'dropper' | 'white_terracotta' | 'orange_terracotta' | 'magenta_terracotta' | 'light_blue_terracotta' | 'yellow_terracotta' | 'lime_terracotta' | 'pink_terracotta' | 'gray_terracotta' | 'light_gray_terracotta' | 'cyan_terracotta' | 'purple_terracotta' | 'blue_terracotta' | 'brown_terracotta' | 'green_terracotta' | 'red_terracotta' | 'black_terracotta' | 'barrier' | 'iron_trapdoor' | 'hay_block' | 'white_carpet' | 'orange_carpet' | 'magenta_carpet' | 'light_blue_carpet' | 'yellow_carpet' | 'lime_carpet' | 'pink_carpet' | 'gray_carpet' | 'light_gray_carpet' | 'cyan_carpet' | 'purple_carpet' | 'blue_carpet' | 'brown_carpet' | 'green_carpet' | 'red_carpet' | 'black_carpet' | 'terracotta' | 'coal_block' | 'packed_ice' | 'acacia_stairs' | 'dark_oak_stairs' | 'slime_block' | 'grass_path' | 'sunflower' | 'lilac' | 'rose_bush' | 'peony' | 'tall_grass' | 'large_fern' | 'white_stained_glass' | 'orange_stained_glass' | 'magenta_stained_glass' | 'light_blue_stained_glass' | 'yellow_stained_glass' | 'lime_stained_glass' | 'pink_stained_glass' | 'gray_stained_glass' | 'light_gray_stained_glass' | 'cyan_stained_glass' | 'purple_stained_glass' | 'blue_stained_glass' | 'brown_stained_glass' | 'green_stained_glass' | 'red_stained_glass' | 'black_stained_glass' | 'white_stained_glass_pane' | 'orange_stained_glass_pane' | 'magenta_stained_glass_pane' | 'light_blue_stained_glass_pane' | 'yellow_stained_glass_pane' | 'lime_stained_glass_pane' | 'pink_stained_glass_pane' | 'gray_stained_glass_pane' | 'light_gray_stained_glass_pane' | 'cyan_stained_glass_pane' | 'purple_stained_glass_pane' | 'blue_stained_glass_pane' | 'brown_stained_glass_pane' | 'green_stained_glass_pane' | 'red_stained_glass_pane' | 'black_stained_glass_pane' | 'prismarine' | 'prismarine_bricks' | 'dark_prismarine' | 'prismarine_stairs' | 'prismarine_brick_stairs' | 'dark_prismarine_stairs' | 'sea_lantern' | 'red_sandstone' | 'chiseled_red_sandstone' | 'cut_red_sandstone' | 'red_sandstone_stairs' | 'repeating_command_block' | 'chain_command_block' | 'magma_block' | 'nether_wart_block' | 'warped_wart_block' | 'red_nether_bricks' | 'bone_block' | 'structure_void' | 'observer' | 'shulker_box' | 'white_shulker_box' | 'orange_shulker_box' | 'magenta_shulker_box' | 'light_blue_shulker_box' | 'yellow_shulker_box' | 'lime_shulker_box' | 'pink_shulker_box' | 'gray_shulker_box' | 'light_gray_shulker_box' | 'cyan_shulker_box' | 'purple_shulker_box' | 'blue_shulker_box' | 'brown_shulker_box' | 'green_shulker_box' | 'red_shulker_box' | 'black_shulker_box' | 'white_glazed_terracotta' | 'orange_glazed_terracotta' | 'magenta_glazed_terracotta' | 'light_blue_glazed_terracotta' | 'yellow_glazed_terracotta' | 'lime_glazed_terracotta' | 'pink_glazed_terracotta' | 'gray_glazed_terracotta' | 'light_gray_glazed_terracotta' | 'cyan_glazed_terracotta' | 'purple_glazed_terracotta' | 'blue_glazed_terracotta' | 'brown_glazed_terracotta' | 'green_glazed_terracotta' | 'red_glazed_terracotta' | 'black_glazed_terracotta' | 'white_concrete' | 'orange_concrete' | 'magenta_concrete' | 'light_blue_concrete' | 'yellow_concrete' | 'lime_concrete' | 'pink_concrete' | 'gray_concrete' | 'light_gray_concrete' | 'cyan_concrete' | 'purple_concrete' | 'blue_concrete' | 'brown_concrete' | 'green_concrete' | 'red_concrete' | 'black_concrete' | 'white_concrete_powder' | 'orange_concrete_powder' | 'magenta_concrete_powder' | 'light_blue_concrete_powder' | 'yellow_concrete_powder' | 'lime_concrete_powder' | 'pink_concrete_powder' | 'gray_concrete_powder' | 'light_gray_concrete_powder' | 'cyan_concrete_powder' | 'purple_concrete_powder' | 'blue_concrete_powder' | 'brown_concrete_powder' | 'green_concrete_powder' | 'red_concrete_powder' | 'black_concrete_powder' | 'turtle_egg' | 'dead_tube_coral_block' | 'dead_brain_coral_block' | 'dead_bubble_coral_block' | 'dead_fire_coral_block' | 'dead_horn_coral_block' | 'tube_coral_block' | 'brain_coral_block' | 'bubble_coral_block' | 'fire_coral_block' | 'horn_coral_block' | 'tube_coral' | 'brain_coral' | 'bubble_coral' | 'fire_coral' | 'horn_coral' | 'dead_brain_coral' | 'dead_bubble_coral' | 'dead_fire_coral' | 'dead_horn_coral' | 'dead_tube_coral' | 'tube_coral_fan' | 'brain_coral_fan' | 'bubble_coral_fan' | 'fire_coral_fan' | 'horn_coral_fan' | 'dead_tube_coral_fan' | 'dead_brain_coral_fan' | 'dead_bubble_coral_fan' | 'dead_fire_coral_fan' | 'dead_horn_coral_fan' | 'blue_ice' | 'conduit' | 'polished_granite_stairs' | 'smooth_red_sandstone_stairs' | 'mossy_stone_brick_stairs' | 'polished_diorite_stairs' | 'mossy_cobblestone_stairs' | 'end_stone_brick_stairs' | 'stone_stairs' | 'smooth_sandstone_stairs' | 'smooth_quartz_stairs' | 'granite_stairs' | 'andesite_stairs' | 'red_nether_brick_stairs' | 'polished_andesite_stairs' | 'diorite_stairs' | 'polished_granite_slab' | 'smooth_red_sandstone_slab' | 'mossy_stone_brick_slab' | 'polished_diorite_slab' | 'mossy_cobblestone_slab' | 'end_stone_brick_slab' | 'smooth_sandstone_slab' | 'smooth_quartz_slab' | 'granite_slab' | 'andesite_slab' | 'red_nether_brick_slab' | 'polished_andesite_slab' | 'diorite_slab' | 'scaffolding' | 'iron_door' | 'oak_door' | 'spruce_door' | 'birch_door' | 'jungle_door' | 'acacia_door' | 'dark_oak_door' | 'crimson_door' | 'warped_door' | 'repeater' | 'comparator' | 'structure_block' | 'jigsaw' | 'turtle_helmet' | 'scute' | 'flint_and_steel' | 'apple' | 'bow' | 'arrow' | 'coal' | 'charcoal' | 'diamond' | 'iron_ingot' | 'gold_ingot' | 'netherite_ingot' | 'netherite_scrap' | 'wooden_sword' | 'wooden_shovel' | 'wooden_pickaxe' | 'wooden_axe' | 'wooden_hoe' | 'stone_sword' | 'stone_shovel' | 'stone_pickaxe' | 'stone_axe' | 'stone_hoe' | 'golden_sword' | 'golden_shovel' | 'golden_pickaxe' | 'golden_axe' | 'golden_hoe' | 'iron_sword' | 'iron_shovel' | 'iron_pickaxe' | 'iron_axe' | 'iron_hoe' | 'diamond_sword' | 'diamond_shovel' | 'diamond_pickaxe' | 'diamond_axe' | 'diamond_hoe' | 'netherite_sword' | 'netherite_shovel' | 'netherite_pickaxe' | 'netherite_axe' | 'netherite_hoe' | 'stick' | 'bowl' | 'mushroom_stew' | 'string' | 'feather' | 'gunpowder' | 'wheat_seeds' | 'wheat' | 'bread' | 'leather_helmet' | 'leather_chestplate' | 'leather_leggings' | 'leather_boots' | 'chainmail_helmet' | 'chainmail_chestplate' | 'chainmail_leggings' | 'chainmail_boots' | 'iron_helmet' | 'iron_chestplate' | 'iron_leggings' | 'iron_boots' | 'diamond_helmet' | 'diamond_chestplate' | 'diamond_leggings' | 'diamond_boots' | 'golden_helmet' | 'golden_chestplate' | 'golden_leggings' | 'golden_boots' | 'netherite_helmet' | 'netherite_chestplate' | 'netherite_leggings' | 'netherite_boots' | 'flint' | 'porkchop' | 'cooked_porkchop' | 'painting' | 'golden_apple' | 'enchanted_golden_apple' | 'oak_sign' | 'spruce_sign' | 'birch_sign' | 'jungle_sign' | 'acacia_sign' | 'dark_oak_sign' | 'crimson_sign' | 'warped_sign' | 'bucket' | 'water_bucket' | 'lava_bucket' | 'minecart' | 'saddle' | 'redstone' | 'snowball' | 'oak_boat' | 'leather' | 'milk_bucket' | 'pufferfish_bucket' | 'salmon_bucket' | 'cod_bucket' | 'tropical_fish_bucket' | 'brick' | 'clay_ball' | 'dried_kelp_block' | 'paper' | 'book' | 'slime_ball' | 'chest_minecart' | 'furnace_minecart' | 'egg' | 'compass' | 'fishing_rod' | 'clock' | 'glowstone_dust' | 'cod' | 'salmon' | 'tropical_fish' | 'pufferfish' | 'cooked_cod' | 'cooked_salmon' | 'ink_sac' | 'cocoa_beans' | 'lapis_lazuli' | 'white_dye' | 'orange_dye' | 'magenta_dye' | 'light_blue_dye' | 'yellow_dye' | 'lime_dye' | 'pink_dye' | 'gray_dye' | 'light_gray_dye' | 'cyan_dye' | 'purple_dye' | 'blue_dye' | 'brown_dye' | 'green_dye' | 'red_dye' | 'black_dye' | 'bone_meal' | 'bone' | 'sugar' | 'cake' | 'white_bed' | 'orange_bed' | 'magenta_bed' | 'light_blue_bed' | 'yellow_bed' | 'lime_bed' | 'pink_bed' | 'gray_bed' | 'light_gray_bed' | 'cyan_bed' | 'purple_bed' | 'blue_bed' | 'brown_bed' | 'green_bed' | 'red_bed' | 'black_bed' | 'cookie' | 'filled_map' | 'shears' | 'melon_slice' | 'dried_kelp' | 'pumpkin_seeds' | 'melon_seeds' | 'beef' | 'cooked_beef' | 'chicken' | 'cooked_chicken' | 'rotten_flesh' | 'ender_pearl' | 'blaze_rod' | 'ghast_tear' | 'gold_nugget' | 'nether_wart' | 'potion' | 'glass_bottle' | 'spider_eye' | 'fermented_spider_eye' | 'blaze_powder' | 'magma_cream' | 'brewing_stand' | 'cauldron' | 'ender_eye' | 'glistering_melon_slice' | 'bat_spawn_egg' | 'bee_spawn_egg' | 'blaze_spawn_egg' | 'cat_spawn_egg' | 'cave_spider_spawn_egg' | 'chicken_spawn_egg' | 'cod_spawn_egg' | 'cow_spawn_egg' | 'creeper_spawn_egg' | 'dolphin_spawn_egg' | 'donkey_spawn_egg' | 'drowned_spawn_egg' | 'elder_guardian_spawn_egg' | 'enderman_spawn_egg' | 'endermite_spawn_egg' | 'evoker_spawn_egg' | 'fox_spawn_egg' | 'ghast_spawn_egg' | 'guardian_spawn_egg' | 'hoglin_spawn_egg' | 'horse_spawn_egg' | 'husk_spawn_egg' | 'llama_spawn_egg' | 'magma_cube_spawn_egg' | 'mooshroom_spawn_egg' | 'mule_spawn_egg' | 'ocelot_spawn_egg' | 'panda_spawn_egg' | 'parrot_spawn_egg' | 'phantom_spawn_egg' | 'pig_spawn_egg' | 'piglin_spawn_egg' | 'piglin_brute_spawn_egg' | 'pillager_spawn_egg' | 'polar_bear_spawn_egg' | 'pufferfish_spawn_egg' | 'rabbit_spawn_egg' | 'ravager_spawn_egg' | 'salmon_spawn_egg' | 'sheep_spawn_egg' | 'shulker_spawn_egg' | 'silverfish_spawn_egg' | 'skeleton_spawn_egg' | 'skeleton_horse_spawn_egg' | 'slime_spawn_egg' | 'spider_spawn_egg' | 'squid_spawn_egg' | 'stray_spawn_egg' | 'strider_spawn_egg' | 'trader_llama_spawn_egg' | 'tropical_fish_spawn_egg' | 'turtle_spawn_egg' | 'vex_spawn_egg' | 'villager_spawn_egg' | 'vindicator_spawn_egg' | 'wandering_trader_spawn_egg' | 'witch_spawn_egg' | 'wither_skeleton_spawn_egg' | 'wolf_spawn_egg' | 'zoglin_spawn_egg' | 'zombie_spawn_egg' | 'zombie_horse_spawn_egg' | 'zombie_villager_spawn_egg' | 'zombified_piglin_spawn_egg' | 'experience_bottle' | 'fire_charge' | 'writable_book' | 'written_book' | 'emerald' | 'item_frame' | 'flower_pot' | 'carrot' | 'potato' | 'baked_potato' | 'poisonous_potato' | 'map' | 'golden_carrot' | 'skeleton_skull' | 'wither_skeleton_skull' | 'player_head' | 'zombie_head' | 'creeper_head' | 'dragon_head' | 'carrot_on_a_stick' | 'warped_fungus_on_a_stick' | 'nether_star' | 'pumpkin_pie' | 'firework_rocket' | 'firework_star' | 'enchanted_book' | 'nether_brick' | 'quartz' | 'tnt_minecart' | 'hopper_minecart' | 'prismarine_shard' | 'prismarine_crystals' | 'rabbit' | 'cooked_rabbit' | 'rabbit_stew' | 'rabbit_foot' | 'rabbit_hide' | 'armor_stand' | 'iron_horse_armor' | 'golden_horse_armor' | 'diamond_horse_armor' | 'leather_horse_armor' | 'lead' | 'name_tag' | 'command_block_minecart' | 'mutton' | 'cooked_mutton' | 'white_banner' | 'orange_banner' | 'magenta_banner' | 'light_blue_banner' | 'yellow_banner' | 'lime_banner' | 'pink_banner' | 'gray_banner' | 'light_gray_banner' | 'cyan_banner' | 'purple_banner' | 'blue_banner' | 'brown_banner' | 'green_banner' | 'red_banner' | 'black_banner' | 'end_crystal' | 'chorus_fruit' | 'popped_chorus_fruit' | 'beetroot' | 'beetroot_seeds' | 'beetroot_soup' | 'dragon_breath' | 'splash_potion' | 'spectral_arrow' | 'tipped_arrow' | 'lingering_potion' | 'shield' | 'elytra' | 'spruce_boat' | 'birch_boat' | 'jungle_boat' | 'acacia_boat' | 'dark_oak_boat' | 'totem_of_undying' | 'shulker_shell' | 'iron_nugget' | 'knowledge_book' | 'debug_stick' | 'music_disc_13' | 'music_disc_cat' | 'music_disc_blocks' | 'music_disc_chirp' | 'music_disc_far' | 'music_disc_mall' | 'music_disc_mellohi' | 'music_disc_stal' | 'music_disc_strad' | 'music_disc_ward' | 'music_disc_11' | 'music_disc_wait' | 'music_disc_pigstep' | 'trident' | 'phantom_membrane' | 'nautilus_shell' | 'heart_of_the_sea' | 'crossbow' | 'suspicious_stew' | 'loom' | 'flower_banner_pattern' | 'creeper_banner_pattern' | 'skull_banner_pattern' | 'mojang_banner_pattern' | 'globe_banner_pattern' | 'piglin_banner_pattern' | 'composter' | 'barrel' | 'smoker' | 'blast_furnace' | 'cartography_table' | 'fletching_table' | 'grindstone' | 'lectern' | 'smithing_table' | 'stonecutter' | 'bell' | 'lantern' | 'soul_lantern' | 'sweet_berries' | 'campfire' | 'soul_campfire' | 'shroomlight' | 'honeycomb' | 'bee_nest' | 'beehive' | 'honey_bottle' | 'honey_block' | 'honeycomb_block' | 'lodestone' | 'netherite_block' | 'ancient_debris' | 'target' | 'crying_obsidian' | 'blackstone' | 'blackstone_slab' | 'blackstone_stairs' | 'gilded_blackstone' | 'polished_blackstone' | 'polished_blackstone_slab' | 'polished_blackstone_stairs' | 'chiseled_polished_blackstone' | 'polished_blackstone_bricks' | 'polished_blackstone_brick_slab' | 'polished_blackstone_brick_stairs' | 'cracked_polished_blackstone_bricks' | 'respawn_anchor';

type version = '21w38a' | '21w37a' | '1.18-exp7' | '1.18-exp6' | '1.18-exp5' | '1.18-exp4' | '1.18-exp3' | '1.18-exp2' | '1.18-exp1' | '1.17.1' | '1.17.1-rc2' | '1.17.1-rc1' | '1.17.1-pre3' | '1.17.1-pre2' | '1.17.1-pre1' | '1.17' | '1.17-rc2' | '1.17-rc1' | '1.17-pre5' | '1.17-pre4' | '1.17-pre3' | '1.17-pre2' | '1.17-pre1' | '21w20a' | '21w19a' | '21w18a' | '21w17a' | '21w16a' | '21w15a' | '21w14a' | '21w13a' | '21w11a' | '21w10a' | '21w08b' | '21w08a' | '21w07a' | '21w06a' | '21w05b' | '21w05a' | '21w03a' | '1.16.5' | '1.16.5-rc1' | '20w51a' | '20w49a' | '20w48a' | '20w46a' | '20w45a' | '1.16.4' | '1.16.4-rc1' | '1.16.4-pre2' | '1.16.4-pre1' | '1.16.3' | '1.16.3-rc1' | '1.16.2' | '1.16.2-rc2' | '1.16.2-rc1' | '1.16.2-pre3' | '1.16.2-pre2' | '1.16.2-pre1' | '20w30a' | '20w29a' | '20w28a' | '20w27a' | '1.16.1' | '1.16' | '1.16-rc1' | '1.16-pre8' | '1.16-pre7' | '1.16-pre6' | '1.16-pre5' | '1.16-pre4' | '1.16-pre3' | '1.16-pre2' | '1.16-pre1' | '20w22a' | '20w21a' | '20w20b' | '20w20a' | '20w19a' | '20w18a' | '20w17a' | '20w16a' | '20w15a' | '20w14a' | '20w13b' | '20w13a' | '20w12a' | '20w11a' | '20w10a' | '20w09a' | '20w08a' | '20w07a' | '20w06a' | '1.15.2' | '1.15.2-pre2' | '1.15.2-pre1' | '1.15.1' | '1.15.1-pre1' | '1.15' | '1.15-pre7' | '1.15-pre6' | '1.15-pre5' | '1.15-pre4' | '1.15-pre3' | '1.15-pre2' | '1.15-pre1' | '19w46b' | '19w46a' | '19w45b' | '19w45a' | '19w44a' | '19w42a' | '19w41a' | '19w40a' | '19w39a' | '19w38b' | '19w38a' | '19w37a' | '19w36a' | '19w35a' | '19w34a' | '1.14.4' | '1.14.4-pre7' | '1.14.4-pre6' | '1.14.4-pre5' | '1.14.4-pre4' | '1.14.4-pre3' | '1.14.4-pre2' | '1.14.4-pre1' | '1.14.3' | '1.14.3 - Combat Test' | '1.14.3-pre4' | '1.14.3-pre3' | '1.14.3-pre2' | '1.14.3-pre1' | '1.14.2' | '1.14.2-pre4' | '1.14.2-pre3' | '1.14.2-pre2' | '1.14.2-pre1' | '1.14.1' | '1.14.1-pre2' | '1.14.1-pre1' | '1.14' | '1.14-pre5' | '1.14-pre4' | '1.14-pre3' | '1.14-pre2' | '1.14-pre1' | '19w14b' | '19w14a' | '19w13b' | '19w13a' | '19w12b' | '19w12a' | '19w11b' | '19w11a' | '19w09a' | '19w08b' | '19w08a' | '19w07a' | '19w06a' | '19w05a' | '19w04b' | '19w04a' | '19w03c' | '19w03b' | '19w03a' | '19w02a' | '18w50a' | '18w49a' | '18w48b' | '18w48a' | '18w47b' | '18w47a' | '18w46a' | '18w45a' | '18w44a' | '18w43c' | '18w43b' | '18w43a' | '1.13.2' | '1.13.2-pre2' | '1.13.2-pre1' | '1.13.1' | '1.13.1-pre2' | '1.13.1-pre1' | '18w33a' | '18w32a' | '18w31a' | '18w30b' | '18w30a' | '1.13' | '1.13-pre10' | '1.13-pre9' | '1.13-pre8' | '1.13-pre7' | '1.13-pre6' | '1.13-pre5' | '1.13-pre4' | '1.13-pre3' | '1.13-pre2' | '1.13-pre1' | '18w22c' | '18w22b' | '18w22a' | '18w21b' | '18w21a' | '18w20c' | '18w20b' | '18w20a' | '18w19b' | '18w19a' | '18w16a' | '18w15a' | '18w14b' | '18w14a' | '18w11a' | '18w10d' | '18w10c' | '18w10b' | '18w10a' | '18w09a' | '18w08b' | '18w08a' | '18w07c' | '18w07b' | '18w07a' | '18w06a' | '18w05a' | '18w03b' | '18w03a' | '18w02a' | '18w01a' | '17w50a' | '17w49b' | '17w49a' | '17w48a' | '17w47b' | '17w47a' | '17w46a' | '17w45b' | '17w45a' | '17w43b' | '17w43a' | '1.12.2' | '1.12.2-pre2' | '1.12.1' | '1.12.1-pre1' | '17w31a' | '1.12' | '1.12-pre7' | '1.12-pre6' | '1.12-pre5' | '1.12-pre4' | '1.12-pre3' | '1.12-pre2' | '1.12-pre1' | '17w18b' | '17w18a' | '17w17b' | '17w17a' | '17w16b' | '17w16a' | '17w15a' | '17w14a' | '17w13b' | '17w13a' | '17w06a' | '1.11' | '1.11-pre1' | '16w44a' | '16w42a' | '16w41a' | '16w40a' | '16w39c' | '16w39b' | '16w39a' | '16w38a' | '16w36a' | '16w35a' | '16w33a' | '16w32b' | '16w32a' | '1.10-pre2' | '1.10-pre1' | '16w21b' | '16w21a' | '16w20a' | '1.RV-Pre1' | '1.9.1-pre1' | '1.9-pre4' | '1.9-pre3' | '1.9-pre2' | '1.9-pre1' | '16w07b' | '16w07a' | '16w06a' | '16w05b' | '16w05a' | '16w04a' | '16w03a' | '16w02a' | '15w51b' | '15w51a' | '15w50a' | '15w49b' | '15w49a' | '15w47c' | '15w47b' | '15w47a' | '15w46a' | '15w45a' | '15w44b' | '15w44a' | '15w43c' | '15w43b' | '15w43a' | '15w42a' | '15w41b' | '15w41a' | '15w40b' | '15w40a' | '15w38b' | '15w38a' | '15w37a' | '15w36d' | '15w36c' | '15w36b' | '15w36a' | '15w35e' | '15w35d' | '15w35c' | '15w35b' | '15w35a' | '15w34d' | '15w34c' | '15w34b' | '15w34a' | '15w33c' | '15w33b' | '15w33a' | '15w32c' | '15w32b' | '15w32a' | '15w31c' | '15w31b' | '15w31a' | '15w14a' | '1.8-pre3' | '1.8-pre2' | '1.8-pre1' | '14w34d' | '14w34c' | '14w34b' | '14w34a' | '14w33c' | '14w33b' | '14w33a' | '14w32d' | '14w32c' | '14w32b' | '14w32a' | '14w31a' | '14w30c' | '14w30b' | '14w29a' | '14w28b' | '14w28a' | '14w27b' | '14w26c' | '14w26b' | '14w26a' | '14w25b' | '14w25a' | '14w21b' | '14w21a' | '14w20b' | '14w19a' | '14w18b' | '14w17a' | '14w11b' | '14w08a' | '14w07a' | '14w06b' | '14w05b' | '14w04b' | '14w04a' | '14w03b' | '1.7.1-pre' | '13w43a' | '13w41b' | '13w41a' | '13w39b' | '1.6.4' | '1.6.3-pre' | '13w37b' | '13w36b' | '1.6.2' | '1.6.1' | '1.6-pre' | '13w24b' | '13w24a' | '13w23b' | '13w19a' | '13w17a' | '13w16b' | '13w16a' | '1.5.2' | '2.0' | '13w09b' | '13w07a' | '13w05b' | '13w04a' | '13w03a' | '13w02b' | '13w01b' | '12w49a' | '1.4.5' | '1.4.3-pre' | '12w40b' | '12w40a' | '12w34a' | '12w32a' | '12w26a' | '12w24a' | '12w23b' | '12w22a' | '12w21b' | '12w19a' | '12w17a' | '12w16a' | '12w07b' | '12w06a' | '1.1' | '12w01a' | 'Beta 1.9-pre5' | 'Beta 1.9-pre4' | 'Beta 1.9-pre1' | 'Beta 1.8-pre2' | 'Beta 1.8-pre1' | 'Beta 1.6 Test Build 3' | 'Beta 1.4_01' | 'Beta 1.3_01' | 'Beta 1.1_01' | 'Alpha 1.2.2' | 'Alpha 1.2.1_01' | 'Alpha 1.0.12' | 'Alpha 1.0.7' | 'Alpha 1.0.0';

type entityType = 'area_effect_cloud' | 'armor_stand' | 'arrow' | 'bat' | 'bee' | 'blaze' | 'boat' | 'cat' | 'cave_spider' | 'chicken' | 'cod' | 'cow' | 'creeper' | 'dolphin' | 'donkey' | 'dragon_fireball' | 'drowned' | 'elder_guardian' | 'end_cry' | 'ender_dragon' | 'enderman' | 'endermite' | 'evoker' | 'evoker_fangs' | 'experience_orb' | 'eye_of_ender' | 'falling_block' | 'firework_rocket' | 'fox' | 'ghast' | 'giant' | 'guardian' | 'hoglin' | 'horse' | 'husk' | 'illusioner' | 'iron_golem' | 'item' | 'item_frame' | 'fireball' | 'leash_knot' | 'lightning_bolt' | 'llama' | 'llama_spit' | 'magma_cube' | 'minecart' | 'chest_minecart' | 'command_block_minecart' | 'furnace_minecart' | 'hopper_minecart' | 'spawner_minecart' | 'tnt_minecart' | 'mule' | 'mooshroom' | 'ocelot' | 'painting' | 'panda' | 'parrot' | 'phantom' | 'pig' | 'piglin' | 'piglin_brute' | 'pillager' | 'polar_bear' | 'tnt' | 'pufferfish' | 'rabbit' | 'ravager' | 'salmon' | 'sheep' | 'shulker' | 'shulker_bullet' | 'silverfish' | 'skeleton' | 'skeleton_horse' | 'slime' | 'small_fireball' | 'snow_golem' | 'snowball' | 'spectral_arrow' | 'spider' | 'squid' | 'stray' | 'strider' | 'egg' | 'ender_pearl' | 'experience_bottle' | 'potion' | 'trident' | 'trader_llama' | 'tropical_fish' | 'turtle' | 'vex' | 'villager' | 'vindicator' | 'wandering_trader' | 'witch' | 'wither' | 'wither_skeleton' | 'wither_skull' | 'wolf' | 'zoglin' | 'zombie' | 'zombie_horse' | 'zombie_villager' | 'zombified_piglin' | 'player' | 'fishing_bobber';

type noDataParticle = 'ambient_entity_effect' | 'angry_villager' | 'bubble' | 'cloud' | 'crit' | 'damage_indicator' | 'dragon_breath' | 'dripping_lava' | 'falling_lava' | 'landing_lava' | 'dripping_water' | 'falling_water' | 'effect' | 'elder_guardian' | 'enchanted_hit' | 'enchant' | 'end_rod' | 'entity_effect' | 'explosion_emitter' | 'explosion' | 'firework' | 'fishing' | 'flame' | 'soul_fire_flame' | 'soul' | 'flash' | 'happy_villager' | 'composter' | 'heart' | 'instant_effect' | 'item_slime' | 'item_snowball' | 'large_smoke' | 'lava' | 'mycelium' | 'note' | 'poof' | 'portal' | 'rain' | 'smoke' | 'sneeze' | 'spit' | 'sweep_attack' | 'totem_of_undying' | 'underwater' | 'splash' | 'witch' | 'bubble_pop' | 'current_down' | 'bubble_column_up' | 'nautilus' | 'dolphin' | 'campfire_cosy_smoke' | 'campfire_signal_smoke' | 'dripping_honey' | 'falling_honey' | 'landing_honey' | 'falling_nectar' | 'ash' | 'crimson_spore' | 'warped_spore' | 'dripping_obsidian_tear' | 'falling_obsidian_tear' | 'landing_obsidian_tear' | 'reverse_portal' | 'snowflake' | 'barrier';

type windowType = 'anvil' | 'beacon' | 'brewingStand' | 'chest' | 'container' | 'craftingTable' | 'dispenser' | 'dropper' | 'enchanting_table' | 'furnace' | 'hopper' | 'villager' /* | 'horse' */;

type blockFace = `${'+' | '-'}${'X' | 'Y' | 'Z'}`;