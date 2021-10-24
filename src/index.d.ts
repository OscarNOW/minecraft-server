declare class Client {
    private constructor(client: any, server: Server);
    private client: any;
    private events: object
    private cachedPosition: {
        x: number;
        y: number;
        z: number;
        onGround: boolean;
        yaw: number;
        pitch: number;
    };
    server: Server;
    username: string;
    uuid: string;
    ping: number;
    online: boolean;
    position: {
        x: number;
        y: number;
        z: number;
        onGround: boolean;
        yaw: number;
        pitch: number;
    };
    entities: {
        [entityId: number]: Entity;
    };
    private emitMove(info: object): void;
    kick(reason: string): void;
    chat(message: string): void;
    chunk(chunk: Chunk, chunkPosition: {
        x: number;
        z: number;
    }): void;
    teleport(position: {
        x: number;
        y: number;
        z: number;
        yaw: number;
        pitch: number;
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
    on(event: 'chat' | 'command', callback: (message: string) => void): void;
    on(event: 'move' | 'leave', callback: () => void): void;
}

declare class Entity {
    private constructor(client: Client, type: entityType, id: number, position: {
        x: number;
        y: number;
        z: number;
        yaw: number;
        pitch: number;
    });
    private living: boolean;
    private typeId: number;
    private uuid: string;
    id: number;
    client: Client;
    type: entityType;
    position: {
        x: number;
        y: number;
        z: number;
        yaw: number;
        pitch: number;
    }

    move(position: {
        x: number;
        y: number;
        z: number;
        yaw: number;
        pitch: number;
    }): void;
}

export class Server {
    constructor(serverOptions: {
        serverList(ip: string): {
            versionMessage: string;
            players: {
                online: number;
                max: number;
                hover: string;
            };
            description: string;
        };
    });
    private events: object;
    private server: any;
    clients: Array<Client>;
    playerCount: number;
    serverList(ip: string): {
        versionMessage: string;
        players: {
            online: number;
            max: number;
            hover: string;
        };
        description: string;
    };
    on(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    close(): void;
}

export class Chunk {
    private chunk: any;
    constructor();
    setBlock(block: blockType, location: {
        x: number;
        y: number;
        z: number;
    }): Chunk;
}

export class Text {
    constructor(text: string | optionalTextArray);
    array: textArray;
    static stringToArray(text: string): textArray;
    static parseArray(text: optionalTextArray): textArray;
    static arrayToString(text: optionalTextArray): string;
    static parseString(text: string): string;
}

type textArray = Array<{
    text: string;
    color: textColor;
    modifiers: Array<textModifier>;
}>;

type optionalTextArray = Array<{
    text: string;
    color?: textColor;
    modifiers?: Array<textModifier>;
} | string> | string;

type blockType = 'air' | 'stone' | 'granite' | 'polished_granite' | 'diorite' | 'polished_diorite' | 'andesite' | 'polished_andesite' | 'grass_block' | 'dirt' | 'coarse_dirt' | 'podzol' | 'cobblestone' | 'oak_planks' | 'spruce_planks' | 'birch_planks' | 'jungle_planks' | 'acacia_planks' | 'dark_oak_planks' | 'oak_sapling' | 'spruce_sapling' | 'birch_sapling' | 'jungle_sapling' | 'acacia_sapling' | 'dark_oak_sapling' | 'bedrock' | 'water' | 'lava' | 'sand' | 'red_sand' | 'gravel' | 'gold_ore' | 'iron_ore' | 'coal_ore' | 'nether_gold_ore' | 'oak_log' | 'spruce_log' | 'birch_log' | 'jungle_log' | 'acacia_log' | 'dark_oak_log' | 'stripped_spruce_log' | 'stripped_birch_log' | 'stripped_jungle_log' | 'stripped_acacia_log' | 'stripped_dark_oak_log' | 'stripped_oak_log' | 'oak_wood' | 'spruce_wood' | 'birch_wood' | 'jungle_wood' | 'acacia_wood' | 'dark_oak_wood' | 'stripped_oak_wood' | 'stripped_spruce_wood' | 'stripped_birch_wood' | 'stripped_jungle_wood' | 'stripped_acacia_wood' | 'stripped_dark_oak_wood' | 'oak_leaves' | 'spruce_leaves' | 'birch_leaves' | 'jungle_leaves' | 'acacia_leaves' | 'dark_oak_leaves' | 'sponge' | 'wet_sponge' | 'glass' | 'lapis_ore' | 'lapis_block' | 'dispenser' | 'sandstone' | 'chiseled_sandstone' | 'cut_sandstone' | 'note_block' | 'white_bed' | 'orange_bed' | 'magenta_bed' | 'light_blue_bed' | 'yellow_bed' | 'lime_bed' | 'pink_bed' | 'gray_bed' | 'light_gray_bed' | 'cyan_bed' | 'purple_bed' | 'blue_bed' | 'brown_bed' | 'green_bed' | 'red_bed' | 'black_bed' | 'powered_rail' | 'detector_rail' | 'sticky_piston' | 'cobweb' | 'grass' | 'fern' | 'dead_bush' | 'seagrass' | 'tall_seagrass' | 'piston' | 'piston_head' | 'white_wool' | 'orange_wool' | 'magenta_wool' | 'light_blue_wool' | 'yellow_wool' | 'lime_wool' | 'pink_wool' | 'gray_wool' | 'light_gray_wool' | 'cyan_wool' | 'purple_wool' | 'blue_wool' | 'brown_wool' | 'green_wool' | 'red_wool' | 'black_wool' | 'moving_piston' | 'dandelion' | 'poppy' | 'blue_orchid' | 'allium' | 'azure_bluet' | 'red_tulip' | 'orange_tulip' | 'white_tulip' | 'pink_tulip' | 'oxeye_daisy' | 'cornflower' | 'wither_rose' | 'lily_of_the_valley' | 'brown_mushroom' | 'red_mushroom' | 'gold_block' | 'iron_block' | 'bricks' | 'tnt' | 'bookshelf' | 'mossy_cobblestone' | 'obsidian' | 'torch' | 'wall_torch' | 'fire' | 'soul_fire' | 'spawner' | 'oak_stairs' | 'chest' | 'redstone_wire' | 'diamond_ore' | 'diamond_block' | 'crafting_table' | 'wheat' | 'farmland' | 'furnace' | 'oak_sign' | 'spruce_sign' | 'birch_sign' | 'acacia_sign' | 'jungle_sign' | 'dark_oak_sign' | 'oak_door' | 'ladder' | 'rail' | 'cobblestone_stairs' | 'oak_wall_sign' | 'spruce_wall_sign' | 'birch_wall_sign' | 'acacia_wall_sign' | 'jungle_wall_sign' | 'dark_oak_wall_sign' | 'lever' | 'stone_pressure_plate' | 'iron_door' | 'oak_pressure_plate' | 'spruce_pressure_plate' | 'birch_pressure_plate' | 'jungle_pressure_plate' | 'acacia_pressure_plate' | 'dark_oak_pressure_plate' | 'redstone_ore' | 'redstone_torch' | 'redstone_wall_torch' | 'stone_button' | 'snow' | 'ice' | 'snow_block' | 'cactus' | 'clay' | 'sugar_cane' | 'jukebox' | 'oak_fence' | 'pumpkin' | 'netherrack' | 'soul_sand' | 'soul_soil' | 'basalt' | 'polished_basalt' | 'soul_torch' | 'soul_wall_torch' | 'glowstone' | 'nether_portal' | 'carved_pumpkin' | 'jack_o_lantern' | 'cake' | 'repeater' | 'white_stained_glass' | 'orange_stained_glass' | 'magenta_stained_glass' | 'light_blue_stained_glass' | 'yellow_stained_glass' | 'lime_stained_glass' | 'pink_stained_glass' | 'gray_stained_glass' | 'light_gray_stained_glass' | 'cyan_stained_glass' | 'purple_stained_glass' | 'blue_stained_glass' | 'brown_stained_glass' | 'green_stained_glass' | 'red_stained_glass' | 'black_stained_glass' | 'oak_trapdoor' | 'spruce_trapdoor' | 'birch_trapdoor' | 'jungle_trapdoor' | 'acacia_trapdoor' | 'dark_oak_trapdoor' | 'stone_bricks' | 'mossy_stone_bricks' | 'cracked_stone_bricks' | 'chiseled_stone_bricks' | 'infested_stone' | 'infested_cobblestone' | 'infested_stone_bricks' | 'infested_mossy_stone_bricks' | 'infested_cracked_stone_bricks' | 'infested_chiseled_stone_bricks' | 'brown_mushroom_block' | 'red_mushroom_block' | 'mushroom_stem' | 'iron_bars' | 'chain' | 'glass_pane' | 'melon' | 'attached_pumpkin_stem' | 'attached_melon_stem' | 'pumpkin_stem' | 'melon_stem' | 'vine' | 'oak_fence_gate' | 'brick_stairs' | 'stone_brick_stairs' | 'mycelium' | 'lily_pad' | 'nether_bricks' | 'nether_brick_fence' | 'nether_brick_stairs' | 'nether_wart' | 'enchanting_table' | 'brewing_stand' | 'cauldron' | 'end_portal' | 'end_portal_frame' | 'end_stone' | 'dragon_egg' | 'redstone_lamp' | 'cocoa' | 'sandstone_stairs' | 'emerald_ore' | 'ender_chest' | 'tripwire_hook' | 'tripwire' | 'emerald_block' | 'spruce_stairs' | 'birch_stairs' | 'jungle_stairs' | 'command_block' | 'beacon' | 'cobblestone_wall' | 'mossy_cobblestone_wall' | 'flower_pot' | 'potted_oak_sapling' | 'potted_spruce_sapling' | 'potted_birch_sapling' | 'potted_jungle_sapling' | 'potted_acacia_sapling' | 'potted_dark_oak_sapling' | 'potted_fern' | 'potted_dandelion' | 'potted_poppy' | 'potted_blue_orchid' | 'potted_allium' | 'potted_azure_bluet' | 'potted_red_tulip' | 'potted_orange_tulip' | 'potted_white_tulip' | 'potted_pink_tulip' | 'potted_oxeye_daisy' | 'potted_cornflower' | 'potted_lily_of_the_valley' | 'potted_wither_rose' | 'potted_red_mushroom' | 'potted_brown_mushroom' | 'potted_dead_bush' | 'potted_cactus' | 'carrots' | 'potatoes' | 'oak_button' | 'spruce_button' | 'birch_button' | 'jungle_button' | 'acacia_button' | 'dark_oak_button' | 'skeleton_skull' | 'skeleton_wall_skull' | 'wither_skeleton_skull' | 'wither_skeleton_wall_skull' | 'zombie_head' | 'zombie_wall_head' | 'player_head' | 'player_wall_head' | 'creeper_head' | 'creeper_wall_head' | 'dragon_head' | 'dragon_wall_head' | 'anvil' | 'chipped_anvil' | 'damaged_anvil' | 'trapped_chest' | 'light_weighted_pressure_plate' | 'heavy_weighted_pressure_plate' | 'comparator' | 'daylight_detector' | 'redstone_block' | 'nether_quartz_ore' | 'hopper' | 'quartz_block' | 'chiseled_quartz_block' | 'quartz_pillar' | 'quartz_stairs' | 'activator_rail' | 'dropper' | 'white_terracotta' | 'orange_terracotta' | 'magenta_terracotta' | 'light_blue_terracotta' | 'yellow_terracotta' | 'lime_terracotta' | 'pink_terracotta' | 'gray_terracotta' | 'light_gray_terracotta' | 'cyan_terracotta' | 'purple_terracotta' | 'blue_terracotta' | 'brown_terracotta' | 'green_terracotta' | 'red_terracotta' | 'black_terracotta' | 'white_stained_glass_pane' | 'orange_stained_glass_pane' | 'magenta_stained_glass_pane' | 'light_blue_stained_glass_pane' | 'yellow_stained_glass_pane' | 'lime_stained_glass_pane' | 'pink_stained_glass_pane' | 'gray_stained_glass_pane' | 'light_gray_stained_glass_pane' | 'cyan_stained_glass_pane' | 'purple_stained_glass_pane' | 'blue_stained_glass_pane' | 'brown_stained_glass_pane' | 'green_stained_glass_pane' | 'red_stained_glass_pane' | 'black_stained_glass_pane' | 'acacia_stairs' | 'dark_oak_stairs' | 'slime_block' | 'barrier' | 'iron_trapdoor' | 'prismarine' | 'prismarine_bricks' | 'dark_prismarine' | 'prismarine_stairs' | 'prismarine_brick_stairs' | 'dark_prismarine_stairs' | 'prismarine_slab' | 'prismarine_brick_slab' | 'dark_prismarine_slab' | 'sea_lantern' | 'hay_block' | 'white_carpet' | 'orange_carpet' | 'magenta_carpet' | 'light_blue_carpet' | 'yellow_carpet' | 'lime_carpet' | 'pink_carpet' | 'gray_carpet' | 'light_gray_carpet' | 'cyan_carpet' | 'purple_carpet' | 'blue_carpet' | 'brown_carpet' | 'green_carpet' | 'red_carpet' | 'black_carpet' | 'terracotta' | 'coal_block' | 'packed_ice' | 'sunflower' | 'lilac' | 'rose_bush' | 'peony' | 'tall_grass' | 'large_fern' | 'white_banner' | 'orange_banner' | 'magenta_banner' | 'light_blue_banner' | 'yellow_banner' | 'lime_banner' | 'pink_banner' | 'gray_banner' | 'light_gray_banner' | 'cyan_banner' | 'purple_banner' | 'blue_banner' | 'brown_banner' | 'green_banner' | 'red_banner' | 'black_banner' | 'white_wall_banner' | 'orange_wall_banner' | 'magenta_wall_banner' | 'light_blue_wall_banner' | 'yellow_wall_banner' | 'lime_wall_banner' | 'pink_wall_banner' | 'gray_wall_banner' | 'light_gray_wall_banner' | 'cyan_wall_banner' | 'purple_wall_banner' | 'blue_wall_banner' | 'brown_wall_banner' | 'green_wall_banner' | 'red_wall_banner' | 'black_wall_banner' | 'red_sandstone' | 'chiseled_red_sandstone' | 'cut_red_sandstone' | 'red_sandstone_stairs' | 'oak_slab' | 'spruce_slab' | 'birch_slab' | 'jungle_slab' | 'acacia_slab' | 'dark_oak_slab' | 'stone_slab' | 'smooth_stone_slab' | 'sandstone_slab' | 'cut_sandstone_slab' | 'petrified_oak_slab' | 'cobblestone_slab' | 'brick_slab' | 'stone_brick_slab' | 'nether_brick_slab' | 'quartz_slab' | 'red_sandstone_slab' | 'cut_red_sandstone_slab' | 'purpur_slab' | 'smooth_stone' | 'smooth_sandstone' | 'smooth_quartz' | 'smooth_red_sandstone' | 'spruce_fence_gate' | 'birch_fence_gate' | 'jungle_fence_gate' | 'acacia_fence_gate' | 'dark_oak_fence_gate' | 'spruce_fence' | 'birch_fence' | 'jungle_fence' | 'acacia_fence' | 'dark_oak_fence' | 'spruce_door' | 'birch_door' | 'jungle_door' | 'acacia_door' | 'dark_oak_door' | 'end_rod' | 'chorus_plant' | 'chorus_flower' | 'purpur_block' | 'purpur_pillar' | 'purpur_stairs' | 'end_stone_bricks' | 'beetroots' | 'grass_path' | 'end_gateway' | 'repeating_command_block' | 'chain_command_block' | 'frosted_ice' | 'magma_block' | 'nether_wart_block' | 'red_nether_bricks' | 'bone_block' | 'structure_void' | 'observer' | 'shulker_box' | 'white_shulker_box' | 'orange_shulker_box' | 'magenta_shulker_box' | 'light_blue_shulker_box' | 'yellow_shulker_box' | 'lime_shulker_box' | 'pink_shulker_box' | 'gray_shulker_box' | 'light_gray_shulker_box' | 'cyan_shulker_box' | 'purple_shulker_box' | 'blue_shulker_box' | 'brown_shulker_box' | 'green_shulker_box' | 'red_shulker_box' | 'black_shulker_box' | 'white_glazed_terracotta' | 'orange_glazed_terracotta' | 'magenta_glazed_terracotta' | 'light_blue_glazed_terracotta' | 'yellow_glazed_terracotta' | 'lime_glazed_terracotta' | 'pink_glazed_terracotta' | 'gray_glazed_terracotta' | 'light_gray_glazed_terracotta' | 'cyan_glazed_terracotta' | 'purple_glazed_terracotta' | 'blue_glazed_terracotta' | 'brown_glazed_terracotta' | 'green_glazed_terracotta' | 'red_glazed_terracotta' | 'black_glazed_terracotta' | 'white_concrete' | 'orange_concrete' | 'magenta_concrete' | 'light_blue_concrete' | 'yellow_concrete' | 'lime_concrete' | 'pink_concrete' | 'gray_concrete' | 'light_gray_concrete' | 'cyan_concrete' | 'purple_concrete' | 'blue_concrete' | 'brown_concrete' | 'green_concrete' | 'red_concrete' | 'black_concrete' | 'white_concrete_powder' | 'orange_concrete_powder' | 'magenta_concrete_powder' | 'light_blue_concrete_powder' | 'yellow_concrete_powder' | 'lime_concrete_powder' | 'pink_concrete_powder' | 'gray_concrete_powder' | 'light_gray_concrete_powder' | 'cyan_concrete_powder' | 'purple_concrete_powder' | 'blue_concrete_powder' | 'brown_concrete_powder' | 'green_concrete_powder' | 'red_concrete_powder' | 'black_concrete_powder' | 'kelp' | 'kelp_plant' | 'dried_kelp_block' | 'turtle_egg' | 'dead_tube_coral_block' | 'dead_brain_coral_block' | 'dead_bubble_coral_block' | 'dead_fire_coral_block' | 'dead_horn_coral_block' | 'tube_coral_block' | 'brain_coral_block' | 'bubble_coral_block' | 'fire_coral_block' | 'horn_coral_block' | 'dead_tube_coral' | 'dead_brain_coral' | 'dead_bubble_coral' | 'dead_fire_coral' | 'dead_horn_coral' | 'tube_coral' | 'brain_coral' | 'bubble_coral' | 'fire_coral' | 'horn_coral' | 'dead_tube_coral_fan' | 'dead_brain_coral_fan' | 'dead_bubble_coral_fan' | 'dead_fire_coral_fan' | 'dead_horn_coral_fan' | 'tube_coral_fan' | 'brain_coral_fan' | 'bubble_coral_fan' | 'fire_coral_fan' | 'horn_coral_fan' | 'dead_tube_coral_wall_fan' | 'dead_brain_coral_wall_fan' | 'dead_bubble_coral_wall_fan' | 'dead_fire_coral_wall_fan' | 'dead_horn_coral_wall_fan' | 'tube_coral_wall_fan' | 'brain_coral_wall_fan' | 'bubble_coral_wall_fan' | 'fire_coral_wall_fan' | 'horn_coral_wall_fan' | 'sea_pickle' | 'blue_ice' | 'conduit' | 'bamboo_sapling' | 'bamboo' | 'potted_bamboo' | 'void_air' | 'cave_air' | 'bubble_column' | 'polished_granite_stairs' | 'smooth_red_sandstone_stairs' | 'mossy_stone_brick_stairs' | 'polished_diorite_stairs' | 'mossy_cobblestone_stairs' | 'end_stone_brick_stairs' | 'stone_stairs' | 'smooth_sandstone_stairs' | 'smooth_quartz_stairs' | 'granite_stairs' | 'andesite_stairs' | 'red_nether_brick_stairs' | 'polished_andesite_stairs' | 'diorite_stairs' | 'polished_granite_slab' | 'smooth_red_sandstone_slab' | 'mossy_stone_brick_slab' | 'polished_diorite_slab' | 'mossy_cobblestone_slab' | 'end_stone_brick_slab' | 'smooth_sandstone_slab' | 'smooth_quartz_slab' | 'granite_slab' | 'andesite_slab' | 'red_nether_brick_slab' | 'polished_andesite_slab' | 'diorite_slab' | 'brick_wall' | 'prismarine_wall' | 'red_sandstone_wall' | 'mossy_stone_brick_wall' | 'granite_wall' | 'stone_brick_wall' | 'nether_brick_wall' | 'andesite_wall' | 'red_nether_brick_wall' | 'sandstone_wall' | 'end_stone_brick_wall' | 'diorite_wall' | 'scaffolding' | 'loom' | 'barrel' | 'smoker' | 'blast_furnace' | 'cartography_table' | 'fletching_table' | 'grindstone' | 'lectern' | 'smithing_table' | 'stonecutter' | 'bell' | 'lantern' | 'soul_lantern' | 'campfire' | 'soul_campfire' | 'sweet_berry_bush' | 'warped_stem' | 'stripped_warped_stem' | 'warped_hyphae' | 'stripped_warped_hyphae' | 'warped_nylium' | 'warped_fungus' | 'warped_wart_block' | 'warped_roots' | 'nether_sprouts' | 'crimson_stem' | 'stripped_crimson_stem' | 'crimson_hyphae' | 'stripped_crimson_hyphae' | 'crimson_nylium' | 'crimson_fungus' | 'shroomlight' | 'weeping_vines' | 'weeping_vines_plant' | 'twisting_vines' | 'twisting_vines_plant' | 'crimson_roots' | 'crimson_planks' | 'warped_planks' | 'crimson_slab' | 'warped_slab' | 'crimson_pressure_plate' | 'warped_pressure_plate' | 'crimson_fence' | 'warped_fence' | 'crimson_trapdoor' | 'warped_trapdoor' | 'crimson_fence_gate' | 'warped_fence_gate' | 'crimson_stairs' | 'warped_stairs' | 'crimson_button' | 'warped_button' | 'crimson_door' | 'warped_door' | 'crimson_sign' | 'warped_sign' | 'crimson_wall_sign' | 'warped_wall_sign' | 'structure_block' | 'jigsaw' | 'composter' | 'target' | 'bee_nest' | 'beehive' | 'honey_block' | 'honeycomb_block' | 'netherite_block' | 'ancient_debris' | 'crying_obsidian' | 'respawn_anchor' | 'potted_crimson_fungus' | 'potted_warped_fungus' | 'potted_crimson_roots' | 'potted_warped_roots' | 'lodestone' | 'blackstone' | 'blackstone_stairs' | 'blackstone_wall' | 'blackstone_slab' | 'polished_blackstone' | 'polished_blackstone_bricks' | 'cracked_polished_blackstone_bricks' | 'chiseled_polished_blackstone' | 'polished_blackstone_brick_slab' | 'polished_blackstone_brick_stairs' | 'polished_blackstone_brick_wall' | 'gilded_blackstone' | 'polished_blackstone_stairs' | 'polished_blackstone_slab' | 'polished_blackstone_pressure_plate' | 'polished_blackstone_button' | 'polished_blackstone_wall' | 'chiseled_nether_bricks' | 'cracked_nether_bricks' | 'quartz_bricks';

type entityType = 'area_effect_cloud' | 'armor_stand' | 'arrow' | 'bat' | 'bee' | 'blaze' | 'boat' | 'cat' | 'cave_spider' | 'chicken' | 'cod' | 'cow' | 'creeper' | 'dolphin' | 'donkey' | 'dragon_fireball' | 'drowned' | 'elder_guardian' | 'end_crystal' | 'ender_dragon' | 'enderman' | 'endermite' | 'evoker' | 'evoker_fangs' | 'experience_orb' | 'eye_of_ender' | 'falling_block' | 'firework_rocket' | 'fox' | 'ghast' | 'giant' | 'guardian' | 'hoglin' | 'horse' | 'husk' | 'illusioner' | 'iron_golem' | 'item' | 'item_frame' | 'fireball' | 'leash_knot' | 'lightning_bolt' | 'llama' | 'llama_spit' | 'magma_cube' | 'minecart' | 'chest_minecart' | 'command_block_minecart' | 'furnace_minecart' | 'hopper_minecart' | 'spawner_minecart' | 'tnt_minecart' | 'mule' | 'mooshroom' | 'ocelot' | 'painting' | 'panda' | 'parrot' | 'phantom' | 'pig' | 'piglin' | 'piglin_brute' | 'pillager' | 'polar_bear' | 'tnt' | 'pufferfish' | 'rabbit' | 'ravager' | 'salmon' | 'sheep' | 'shulker' | 'shulker_bullet' | 'silverfish' | 'skeleton' | 'skeleton_horse' | 'slime' | 'small_fireball' | 'snow_golem' | 'snowball' | 'spectral_arrow' | 'spider' | 'squid' | 'stray' | 'strider' | 'egg' | 'ender_pearl' | 'experience_bottle' | 'potion' | 'trident' | 'trader_llama' | 'tropical_fish' | 'turtle' | 'vex' | 'villager' | 'vindicator' | 'wandering_trader' | 'witch' | 'wither' | 'wither_skeleton' | 'wither_skull' | 'wolf' | 'zoglin' | 'zombie' | 'zombie_horse' | 'zombie_villager' | 'zombified_piglin' | 'player' | 'fishing_bobber';

type windowType = 'anvil' | 'beacon' | 'brewingStand' | 'chest' | 'container' | 'craftingTable' | 'dispenser' | 'dropper' | 'enchanting_table' | 'furnace' | 'hopper' | 'villager' /* | 'horse' */;

type textColor = 'darkRed' | 'red' | 'gold' | 'yellow' | 'darkGreen' | 'green' | 'aqua' | 'darkAqua' | 'darkBlue' | 'blue' | 'pink' | 'purple' | 'white' | 'gray' | 'darkGray' | 'black' | 'default';

type textModifier = 'bold' | 'italic' | 'underline' | 'strike' | 'random';