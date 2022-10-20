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
                hover?: string | {
                    name: string;
                    uuid: string;
                }[];
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
        proxy?: {
            outgoingCallback: (client: Client, name: string, packet: object) => void;
            getIncomingCallback: (incomingCallback: (client: Client, name: string, packet: object) => void) => void;
        }
    });

    readonly clients: Client[];

    close(): void;

    on(event: 'join' | 'leave' | 'connect', callback: (client: Client) => void): void;
    on(event: 'error', callback: (customError: CustomError) => void): void;

    once(event: 'join' | 'leave' | 'connect', callback: (client: Client) => void): void;
    once(event: 'error', callback: (customError: CustomError) => void): void;
}