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
            players: {
                online: number;
                max: number;
                hover?: string | Array<{
                    name: string;
                    uuid: string;
                }>;
            };
            description?: string | Text;
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
            reducedDebugInfo: boolean;

            slot?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
            position: {
                x: number;
                y: number;
                z: number;
                yaw?: number;
                pitch?: number;
            };

            clearSky?: boolean;
            showRespawnScreen?: boolean;
            gamemode?: 'survival' | 'creative' | 'adventure' | 'spectator';

            health?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
            food?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
            foodSaturation?: 0 | 1 | 2 | 3 | 4 | 5;

            difficulty?: 'peaceful' | 'easy' | 'normal' | 'hard';
        };
    });

    private events: object;
    private server: any;

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