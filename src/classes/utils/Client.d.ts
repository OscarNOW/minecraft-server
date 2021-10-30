type Server = import('../exports/Server').Server;
type Entity = import('./Entity').Entity;
type Chunk = import('../exports/Chunk').Chunk;

export class Client {
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
    locale: {
        code: string;
        name: string;
        localName?: string;
    };
    viewDistance: number;
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
    on(event: 'chat', callback: (message: string) => void): void;
    on(event: 'move' | 'leave', callback: () => void): void;
}

type entityType = 'area_effect_cloud' | 'armor_stand' | 'arrow' | 'bat' | 'bee' | 'blaze' | 'boat' | 'cat' | 'cave_spider' | 'chicken' | 'cod' | 'cow' | 'creeper' | 'dolphin' | 'donkey' | 'dragon_fireball' | 'drowned' | 'elder_guardian' | 'end_crystal' | 'ender_dragon' | 'enderman' | 'endermite' | 'evoker' | 'evoker_fangs' | 'experience_orb' | 'eye_of_ender' | 'falling_block' | 'firework_rocket' | 'fox' | 'ghast' | 'giant' | 'guardian' | 'hoglin' | 'horse' | 'husk' | 'illusioner' | 'iron_golem' | 'item' | 'item_frame' | 'fireball' | 'leash_knot' | 'lightning_bolt' | 'llama' | 'llama_spit' | 'magma_cube' | 'minecart' | 'chest_minecart' | 'command_block_minecart' | 'furnace_minecart' | 'hopper_minecart' | 'spawner_minecart' | 'tnt_minecart' | 'mule' | 'mooshroom' | 'ocelot' | 'painting' | 'panda' | 'parrot' | 'phantom' | 'pig' | 'piglin' | 'piglin_brute' | 'pillager' | 'polar_bear' | 'tnt' | 'pufferfish' | 'rabbit' | 'ravager' | 'salmon' | 'sheep' | 'shulker' | 'shulker_bullet' | 'silverfish' | 'skeleton' | 'skeleton_horse' | 'slime' | 'small_fireball' | 'snow_golem' | 'snowball' | 'spectral_arrow' | 'spider' | 'squid' | 'stray' | 'strider' | 'egg' | 'ender_pearl' | 'experience_bottle' | 'potion' | 'trident' | 'trader_llama' | 'tropical_fish' | 'turtle' | 'vex' | 'villager' | 'vindicator' | 'wandering_trader' | 'witch' | 'wither' | 'wither_skeleton' | 'wither_skull' | 'wolf' | 'zoglin' | 'zombie' | 'zombie_horse' | 'zombie_villager' | 'zombified_piglin' | 'player' | 'fishing_bobber';

type windowType = 'anvil' | 'beacon' | 'brewingStand' | 'chest' | 'container' | 'craftingTable' | 'dispenser' | 'dropper' | 'enchanting_table' | 'furnace' | 'hopper' | 'villager' /* | 'horse' */;