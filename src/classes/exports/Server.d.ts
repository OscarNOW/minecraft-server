type ProxyClient = import('./ProxyClient').ProxyClient;

type Client = import('../utils/Client').Client;
type CustomError = import('../utils/CustomError').CustomError;

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
            description?: Text | textInput;
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

    joinProxyClient(proxyClient: ProxyClient): void;

    close(): Promise<void>; //todo: change to async function?

    on(event: 'listening', callback: () => void): void;
    on(event: 'join' | 'leave' | 'connect', callback: (client: Client) => void): void;
    on(event: 'error', callback: (customError: CustomError) => void): void;

    once(event: 'listening', callback: () => void): void;
    once(event: 'join' | 'leave' | 'connect', callback: (client: Client) => void): void;
    once(event: 'error', callback: (customError: CustomError) => void): void;
}