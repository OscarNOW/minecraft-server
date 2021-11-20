type Client = import('../utils/Client').Client;

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
    readonly clients: Array<Client>;
    readonly playerCount: number;
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