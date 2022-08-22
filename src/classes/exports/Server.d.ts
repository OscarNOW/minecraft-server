type Client = import('../utils/Client').Client;

export class Server {
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
            favicon?: Buffer;
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
        defaultClientProperties?(client: Client): defaultClientProperties;
    });

    readonly clients: Array<Client>;

    private server: any;
    private intervals: NodeJS.Timer[];

    close(): void;

    on(event: 'join' | 'leave' | 'connect', callback: (Client: Client) => void): void;
}