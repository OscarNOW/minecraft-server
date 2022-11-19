const { Server, Chunk } = require('../');

let chunk = new Chunk();
for (let x = 0; x < 16; x++)
    for (let z = 0; z < 16; z++)
        for (let y = 0; y < 100; y++)
            chunk.setBlock('dirt', { x, y, z })

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

console.log('Listening')
server.on('connect', client => {
    for (let x = -5; x < 5; x++)
        for (let z = -5; z < 5; z++)
            client.chunk(chunk, { x, z });

    client.tabItem({
        name: 'test',
        skinAccountUuid: '069a79f4-44e9-4726-a5be-fca90e38aaf5'
    })

    return;
    client.raw('player_info', {
        action: 0,
        data: [{
            UUID: '57c28f3e-47f6-4b2d-9b32-1ce0e078f813',
            name: 'Jeroen64',
            // properties: [ //Jeroen64
            //     {
            //         "name": "textures",
            //         "value": "ewogICJ0aW1lc3RhbXAiIDogMTY2ODg2MTkxMDI2OCwKICAicHJvZmlsZUlkIiA6ICI1N2MyOGYzZTQ3ZjY0YjJkOWIzMjFjZTBlMDc4ZjgxMyIsCiAgInByb2ZpbGVOYW1lIiA6ICJKZXJvZW42NCIsCiAgInNpZ25hdHVyZVJlcXVpcmVkIiA6IHRydWUsCiAgInRleHR1cmVzIiA6IHsKICAgICJTS0lOIiA6IHsKICAgICAgInVybCIgOiAiaHR0cDovL3RleHR1cmVzLm1pbmVjcmFmdC5uZXQvdGV4dHVyZS83YmEwMzg4NmIzMTJjNTUwMjQwM2RlOGFlY2MwOGI1MDVmZTRjM2IxN2MzM2YwNDFhYzNjMzFkOTdkNzU3ZTFmIgogICAgfQogIH0KfQ==",
            //         "signature": "KM3l7pTS93nkFWauF0/R1Mp0zfva58TqSR5bTO9P5Mp4lMk5igewKatGNBkGxXcv3QSQPv5ljUPCeRNeYglduUCbUuNtTHgpNQ2jNOyxTcLTTjSn1s8jn34xNkR/MQISAkhEm8Xat76ETXIZdSi7zNIStpxO8HP2HSNBjLNcrmQePf6OAuaieNs5q/rZ6BMk18MXoed6YOxsNk7YN7mmoZbPm7eQfOWb+lWUt+EkDzro8bVIWossB/w+m9gloaFkWZ7lixVzWkw9xcEB0MDQXTJ89VYN370psnInXhao+v37flvxfFsu/iZxmNJbk6+dbC7eezQnspYrBymY365hNcce3vTqjQJ4u8ykGdjRePNhBPmPFnJTEyznHoZIfdeUDhkZ1RYP99jCmXEuNMBpSKmO3RIeR9S2xwahRXsdSPUB1P1cfslO01whb/naSYkjoIa4Cc/SdMs596ajYS01SiyVXvTY+z294EEsIfyQuXHzJjIKbwMQ2yaRS8X8EZQ9Tbx/4cMTa00tk3tMoj9kMl44VNSUwZzM9ynZYfHANFMR56qwcKEkr4t/uV6Jow5AZhUNIlh352tz0bJziRuYDOiw1Ax4zDnOzeJxOW6ZUQu6Sx2QX974qvlvdH5zEXgwsNefRi1TnHkVTGN5a0U0yQnD72OIceXZtcwjPu2gApk="
            //     }
            // ],
            properties: [ //Notch
                {
                    "name": "textures",
                    "value": "ewogICJ0aW1lc3RhbXAiIDogMTY2ODg2ODAyNjkxNywKICAicHJvZmlsZUlkIiA6ICIwNjlhNzlmNDQ0ZTk0NzI2YTViZWZjYTkwZTM4YWFmNSIsCiAgInByb2ZpbGVOYW1lIiA6ICJOb3RjaCIsCiAgInNpZ25hdHVyZVJlcXVpcmVkIiA6IHRydWUsCiAgInRleHR1cmVzIiA6IHsKICAgICJTS0lOIiA6IHsKICAgICAgInVybCIgOiAiaHR0cDovL3RleHR1cmVzLm1pbmVjcmFmdC5uZXQvdGV4dHVyZS8yOTIwMDlhNDkyNWI1OGYwMmM3N2RhZGMzZWNlZjA3ZWE0Yzc0NzJmNjRlMGZkYzMyY2U1NTIyNDg5MzYyNjgwIgogICAgfQogIH0KfQ==",
                    "signature": "e4+PIGWTYUsr2PLl6XHwKkD8i0CwlkvHy0egnDaNFIKhIE+iW4gQLKNW/f10hTdhw82oK0rrhocEGe94zqqt4lsu19VuaYcUyPMSOx8teRVanp0BRVdxjGruYmFPgSPWPpck9pH4o+EGBurlTVSgRJl9b//G76LcK5QQMNoEmiGWI9OB5LAqP4hD+OzRtQZm4tZ0atpuphKUZ0YgrgISkfG+Yxa/nZDR0d0NHHUqMWkVN70+AFKqbaoA5QjZhmkmeIbUeXHnAKecwZIXf4NxtpDqH0QUZeB7PzEb0stN5R/xyTJefFZyDk6YInDAvI3M+hRhbRnPfQetKVYlyqD2iCW8sCwjIDOtkqVSLtMCri35xx/xRPEoi9cfIhNAGl8E8stpSPipx1ZNqa2pXqQbuxZ86IC8VygGGgLBBKEcVO1yPVzJ/VtGPBJNXUwBJ3L5APob3gdTxKhYok6sZc+5iQmqI02UbAxRb4/TWXWv7yxXXZiWF6uaJtPRVrxiv+Rp457YSmG7MPVmtRykDEQmDmKHlcqueBF6UD7ENnyynDRyGo7R9Eqe88Gv4IqF6HzdptfduDN+A97nOgC1qZw38WD3RKKW0w/jZEx11SdkI4D44l3suaacCyx8tJL/QY15IyBD0r5HYwRtLxjfzVTbE+lKhelgaARiwq+oYf6pEwA="
                }
            ],
            // properties: [],
            gamemode: 0,
            ping: 1000
        }]
    })

    client.raw('named_entity_spawn', {
        entityId: 10,
        playerUUID: '57c28f3e-47f6-4b2d-9b32-1ce0e078f813',
        x: 3,
        y: 101,
        z: 3,
        yaw: 0,
        pitch: 0
    })

})