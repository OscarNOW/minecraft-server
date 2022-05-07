type Server = import('../exports/Server').Server;

export class InformationClient {
    private constructor(client: any, server: Server);

    readonly server: Server;
    readonly username: string;
    readonly uuid: string;
    readonly entityId: number;
    readonly ping: number;
    readonly textures: {
        skin: string;
        cape?: string;
    };

    kick(reason: string | Text): void;
}