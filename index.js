const { Chunk, Server, Text } = require('./src/index');

const settings = {
    chunkLoad: 7,
    chunkLoadWait: 50,
    chunkLoadBusyThreshold: 100,
    chunkLoadBusyWait: 10,
    prioChunkLoad: 3,
    prioChunkLoadWait: 3,
    prioChunkLoadBusyThreshold: 100,
    prioChunkLoadBusyWait: 0
}

const wait = ms => new Promise(res => setTimeout(res, ms));
let chunk = new Chunk()

for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++) {
        for (let y = 1; y <= 98; y++)
            chunk.setBlock('stone', { x, y, z })
        for (let y = 98; y <= 99; y++)
            chunk.setBlock('dirt', { x, y, z })
        chunk.setBlock('grass_block', { x, y: 100, z })
    }

const server = new Server({
    serverList: ip => ({
        versionMessage: 'Please use version 1.16.3',
        players: {
            online: 0,
            max: 0,
            hover: `Hi`
        },
        description: `Your ip is ${ip}`
    })
});

server.on('join', client => {
    client.difficulty('easy');
    let horse = client.entity('horse', { x: 10, y: 101, z: 10, yaw: 0, pitch: 0 });

    horse.on('leftClick', () => {
        client.demo('startScreen')
    })

    setTimeout(() => {
        client.teleport({ x: 0, y: 120, z: 0, yaw: 0, pitch: 0 });
    }, 3000); //Look if client sends packet when ready to be teleported, instead of arbitrary wait

    let loadedChunks = [];
    let loadingChunks = []
    let prioLoadingChunks = [{ x: 0, z: 0, instant: true }];

    (async () => {
        while (client.online) {
            if (loadingChunks.length > settings.chunkLoadBusyThreshold)
                await wait(settings.chunkLoadBusyWait)
            else
                await wait(settings.chunkLoadWait)

            if (loadingChunks[0]) {
                if (loadedChunks.includes(`${loadingChunks[0].x};${loadingChunks[0].y}`) || prioLoadingChunks.find(v => v.x == loadingChunks[0].x && v.y == loadingChunks[0].y)) {
                    loadingChunks.shift();
                    continue;
                }

                let debugMessage = [loadingChunks.length > settings.chunkLoadBusyThreshold ? '@' : ' ', '   ', loadingChunks.length, '   ', require('util').inspect(loadingChunks[0])].join('')
                // console.log(debugMessage)
                // client.chat(debugMessage)

                loadedChunks.push(`${loadingChunks[0].x};${loadingChunks[0].z}`)
                if (client.online)
                    client.chunk(chunk, loadingChunks[0])

                loadingChunks.shift();
            }
        }
    })();

    (async () => {
        while (client.online) {
            if ((!prioLoadingChunks[0]) || !prioLoadingChunks[0].instant)
                if (prioLoadingChunks.length > settings.prioChunkLoadBusyThreshold)
                    await wait(settings.prioChunkLoadBusyWait)
                else
                    await wait(settings.prioChunkLoadWait)

            if (prioLoadingChunks[0]) {
                if (loadedChunks.includes(`${prioLoadingChunks[0].x};${prioLoadingChunks[0].y}`)) {
                    prioLoadingChunks.shift();
                    continue;
                }

                let debugMessage = [prioLoadingChunks[0].instant ? '&' : prioLoadingChunks.length > settings.prioChunkLoadBusyThreshold ? '@' : ' ', '## ', prioLoadingChunks.length, '   ', require('util').inspect(prioLoadingChunks[0])].join('')
                // console.log(debugMessage)
                // client.chat(debugMessage)

                loadedChunks.push(`${prioLoadingChunks[0].x};${prioLoadingChunks[0].z}`)
                if (client.online)
                    client.chunk(chunk, prioLoadingChunks[0])

                prioLoadingChunks.shift();
            }
        }
    })();

    client.on('move', () => {
        for (let xOffset = -settings.prioChunkLoad; xOffset <= settings.prioChunkLoad; xOffset++)
            for (let zOffset = -settings.prioChunkLoad; zOffset <= settings.prioChunkLoad; zOffset++) {

                let chunkX = Math.floor(client.position.x / 16) + xOffset;
                let chunkZ = Math.floor(client.position.z / 16) + zOffset;

                if (!loadedChunks.includes(`${chunkX};${chunkZ}`) && !prioLoadingChunks.find(v => v.x == chunkX && v.z == chunkZ))
                    prioLoadingChunks.push({ x: chunkX, z: chunkZ })

            }

        for (let xOffset = -settings.chunkLoad; xOffset <= settings.chunkLoad; xOffset++)
            for (let zOffset = -settings.chunkLoad; zOffset <= settings.chunkLoad; zOffset++) {

                let chunkX = Math.floor(client.position.x / 16) + xOffset;
                let chunkZ = Math.floor(client.position.z / 16) + zOffset;

                let instant = Math.floor(client.position.x / 16) == 0 && Math.floor(client.position.z / 16) == 0;
                // let instant = false;

                if ((!loadedChunks.includes(`${chunkX};${chunkZ}`)) && (!loadingChunks.find(v => v.x == chunkX && v.z == chunkZ)) && (!prioLoadingChunks.find(v => v.x == chunkX && v.z == chunkZ)))
                    if (instant)
                        prioLoadingChunks.push({ x: chunkX, z: chunkZ, instant })
                    else
                        loadingChunks.push({ x: chunkX, z: chunkZ })

            }
    })
});