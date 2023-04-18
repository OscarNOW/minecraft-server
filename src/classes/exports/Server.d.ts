type ProxyClient = import('./ProxyClient').ProxyClient;

type Client = import('../utils/Client').Client;
type CustomError = import('../utils/CustomError').CustomError;

/**
 * @see https://oscarnow.github.io/minecraft-server/{version}/classes/Server
 * @example const server = new Server({
 *
 *      serverList: ({ ip, connection: { host, port }, version, legacy }) => ({
 *          description: `Hi there!\n${legacy ? "You've sent a legacy ping" : "You've sent a normal ping"}`,
 *          players: {
 *              online: server.clients.length,
 *              max: 100, // only for serverList, doesn't affect actual max clients
 *              hover: [ip, `${host}: ${port}`, version].join('\n')
 *          },
 *          version: {
 *              wrongText: 'Please use version 1.16.3',
 *              correct: '1.16.3' // only for serverList, doesn't affect actual correct version
 *          },
 *          favicon: fs.readFileSync('./favicon.png')
 *      }),
 *
 *      wrongVersionConnect: ({ ip, connection: { host, port }, version, legacy }) =>
 *          `You've connected with the wrong version!\nExtra info:\nip: ${ip}, host: ${host}, port: ${port}, version: ${version}, legacy: ${legacy ? 'yes' : 'no'}`,
 *
 *      defaultClientProperties: client => ({
 *          clearSky: true,
 *          difficulty: client.username === 'notch' ? 'hard' : 'normal',
 *          food: 20,
 *          foodSaturation: 5,
 *          gamemode: 'survival',
 *          health: 20,
 *          reducedDebugInfo: false,
 *          showRespawnScreen: true,
 *          slot: 0
 *      })
 *
 *  });
 */
export class Server {
    constructor(serverOptions: {
        /**
         * @example serverList: ({ ip }) => ({
         *
         *      description: `A minecraft server\nYour ip is ${ip}`,
         *      players: {
         *          online: server.clients.length,
         *          max: 100
         *      },
         *      version: {
         *          wrongText: 'Please use 1.16.3'
         *      }
         *
         * })         *
         * @example serverList: ({ ip, connection: { host, port }, version }) => ({
         *
         *      description: new Text([
         *          { text: 'Connected through: ', color: 'gray' },
         *          { text: `${host}:${port}`, color: 'white', modifiers: ['bold'] },
         *          { text: '\nYour ip: ', color: 'gray' },
         *          { text: ip, color: 'white', modifiers: ['bold'] }
         *      ]),
         *
         *      players: {
         *          online: server.clients.length + 5,
         *          max: Math.floor(Math.random() * 100) + 5,
         *          hover: 'More\nthan\n1\nline!'
         *      },
         *
         *      version: {
         *          wrongText: 'Wrong version!',
         *
         *          /*  Tell client that the correct version is their version, so they
         *              always think they have the correct version. Reported client
         *              version is null when the version of the client is unknown      * /
         *          correct: version === null ? '1.16.3' : version
         *      },
         *
         *      favicon: fs.readFileSync('./favicon.png')
         *
         *  })
         */
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

    close(): Promise<void>;

    on(event: 'listening', callback: () => void): void; *
        on(event: 'join' | 'leave' | 'connect', callback: (client: Client) => void): void;
    on(event: 'error', callback: (customError: CustomError) => void): void;

    once(event: 'listening', callback: () => void): void;
    once(event: 'join' | 'leave' | 'connect', callback: (client: Client) => void): void;
    once(event: 'error', callback: (customError: CustomError) => void): void;
}