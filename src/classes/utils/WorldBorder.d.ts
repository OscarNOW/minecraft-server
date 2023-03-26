type Client = import('./Client').Client;
type Server = import('../exports/Server').Server;

export class WorldBorder {
    constructor();

    readonly client: Client;
    readonly server: Server;

    get center(): { x: number; z: number };
    set center(center: Partial<{ x: number; z: number }>);

    radius: number;
    warningSeconds: number;
    warningBlocks: number;

    //todo: implement on('change')

    reset(): void;
}