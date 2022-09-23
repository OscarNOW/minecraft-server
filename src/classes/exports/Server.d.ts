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
    });

    readonly clients: Client[];

    private server: any;
    private intervals: NodeJS.Timer[];

    private emitError(customError: CustomError): void;

    close(): void;

    on(event: 'join' | 'leave' | 'connect', callback: (client: Client) => void): void;
    on(event: 'error', callback: (customError: CustomError) => void): void;
}