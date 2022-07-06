const wait = ms => new Promise(res => setTimeout(res, ms));

module.exports = {
    player: async function () {
        throw new Error('Not implemented');

        if (!this.p.canUsed)
            if (this.online)
                throw new Error(`This action can't be performed on this Client right now. This may be because the Client is no longer online or that the client is not ready to receive this packet.`)
            else
                throw new Error(`Can't perform this action on an offline player`)

        this.p.sendPacket('player_info', {
            action: 0,
            data: {
                UUID: '57c28f3e-47f6-4b2d-9b32-1ce0e078f813',
                name: 'Jeroen64',
                properties: [
                    {
                        name: "textures",
                        value: "ewogICJ0aW1lc3RhbXAiIDogMTY1NzExMTQ1NDM5OCwKICAicHJvZmlsZUlkIiA6ICI1N2MyOGYzZTQ3ZjY0YjJkOWIzMjFjZTBlMDc4ZjgxMyIsCiAgInByb2ZpbGVOYW1lIiA6ICJKZXJvZW42NCIsCiAgInNpZ25hdHVyZVJlcXVpcmVkIiA6IHRydWUsCiAgInRleHR1cmVzIiA6IHsKICAgICJTS0lOIiA6IHsKICAgICAgInVybCIgOiAiaHR0cDovL3RleHR1cmVzLm1pbmVjcmFmdC5uZXQvdGV4dHVyZS83YmEwMzg4NmIzMTJjNTUwMjQwM2RlOGFlY2MwOGI1MDVmZTRjM2IxN2MzM2YwNDFhYzNjMzFkOTdkNzU3ZTFmIgogICAgfQogIH0KfQ==",
                        signature: "tAfT+QY6KggTd1Sb7JCHaXrywr23jaclDqvAbgruRvWFzQszDnKCU6llMphRMmWfzcMYbWn+psfNgFm/L+YYQwZn1SBidXfbUP/AgZ2xVlM02jD6XBZQNj1XClnOLYZ+Bk07H1MUEie64EeP4dEe1gzrY+mrglJI7yYsqqxrqziqEijgMYi3JrhmgY7v0ickf4ct1gAfPoCPkhg4Ftv1Ozhtao6/jVCKCL3kVuoUj0kPIj4AiNPEYTj8VTpdXXyEjdOg7+w4HqO8gDX7Rae6PVhjwf854wyqBNR5VnD8tOSRs+kOjpfSTRp5FO+GZ+9cwtddN7E/5ET2UcT2LILeDGRvPInCQLABX2merHYwogRdGDkTPC3Vusi5MjXs93EDzJ8sR7MFBp8qSlS2mJ8/fTAX4SrL/yA7quwGrUq/cEwtCxPTpkrOBUBGF0O9Vx3Xz3yq21LxVQpzIqOmC9BxVWlZuKzlNvQmeEpwJ0KPO/ba03gochVTYVj30taJBQkMIUdekkoxtJNDdwDl3KAiWNVXoDwZYJMmNovCsQxsQxW3eD7tw1ktvDLZjgPLk4Q+bvo+lhh2+noUnugGVX17N+s+z5HDMFxq/Qrlz2bOE7v/fGPqPQylU2wkFf5QViu+k6aOCrr3Ju2Z3IacWVUdmoXI05J+YF/u3n2wpFBc1N4="
                    }
                ],
                gamemode: 0,
                ping: 100,
                displayName: 'Jeroen64'
            }
        })

        this.p.sendPacket('named_entity_spawn', {
            entityId: 13,
            playerUUID: '57c28f3e-47f6-4b2d-9b32-1ce0e078f813',
            x: 3,
            y: 103,
            z: 3,
            yaw: 0,
            pitch: 0
        })
    }
}