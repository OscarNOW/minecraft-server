const { Server } = require('../');

main();
async function main() {
    console.time('server  ');
    const server = new Server({
        defaultClientProperties: () => ({
            gamemode: 'creative',
            position: {
                x: 5,
                y: 101,
                z: 5
            }
        })
    });
    await server.listen();
    console.timeEnd('server  ');

    server.close();
};