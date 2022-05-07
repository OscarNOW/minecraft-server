type Client = import('../utils/Client').Client;
type InformationClient = import('../utils/InformationClient').InformationClient;

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
        wrongVersionConnect(client: InformationClient): void;
    });
    serverList(ip: string): {
        versionMessage: string;
        players: {
            online: number;
            max: number;
            hover: string;
        };
        description: string;
    };
    wrongVersionConnect(client: InformationClient): void;

    private events: object;
    private server: any;

    readonly clients: Array<Client>;
    readonly playerCount: number;

    on(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    close(): void;
}