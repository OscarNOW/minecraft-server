import { EventEmitter } from 'events';

type Client = import('../utils/Client').Client;

export class Server extends EventEmitter {
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
        defaultClientProperties?(client: Client): {
            experience?: {
                bar?: number;
                level?: number;
            };

            raining?: boolean;
            toxicRainLevel?: number;
            showRespawnScreen?: boolean;
            gamemode?: 'survival' | 'creative' | 'adventure' | 'spectator';
            difficulty?: 'peaceful' | 'easy' | 'normal' | 'hard';

            slot?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
            health?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
            food?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
            foodSaturation?: 0 | 1 | 2 | 3 | 4 | 5;
        };
    });

    private server: any;
    private intervals: NodeJS.Timer[];

    readonly clients: Array<Client>;
    readonly playerCount: number;

    close(): void;

    on(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    addListener(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    once(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    prependListener(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    prependOnceListener(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    off(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    removeListener(event: 'join' | 'leave', callback: (Client: Client) => void): void;
    removeAllListeners(event?: 'join' | 'leave'): void;
    rawListeners(event: 'join' | 'leave'): ((client: Client) => void)[];
}