## Existing API changes
None

## New API
* [<Server>.on('listening', () => { })](https://oscarnow.github.io/minecraft-server/{version}/classes/Server#on)
* [<Client>.entity('experience_orb', ...)](https://oscarnow.github.io/minecraft-server/{version}/classes/Client#entity.entity-2)
* [<Client>.blocks](https://oscarnow.github.io/minecraft-server/{version}/classes/Client#blocks)
* [previousBlock argument in <Client>.on('blockBreak', location, previousBlock)](https://oscarnow.github.io/minecraft-server/{version}/classes/Client#on)

* [<Chunk>.updateBlock(](https://oscarnow.github.io/minecraft-server/{version}/classes/Chunk#updateBlock)
* [<Client>.updateBlock(](https://oscarnow.github.io/minecraft-server/{version}/classes/Client#updateBlock)

* [<Client>.acknowledgeBlockBreak](https://oscarnow.github.io/minecraft-server/{version}/classes/Client#acknowledgeBlockBreak)
* [<Client>.acknowledgeAcknowledgeDigCancel](https://oscarnow.github.io/minecraft-server/{version}/classes/Client#acknowledgeDigCancel)
* [<Client>.acknowledgeAcknowledgeDigStart](https://oscarnow.github.io/minecraft-server/{version}/classes/Client#acknowledgeDigStart)

* [WorldBorder](https://oscarnow.github.io/minecraft-server/{version}/classes/WorldBorder)
* [<Client>.worldBorder](https://oscarnow.github.io/minecraft-server/{version}/classes/Client#worldBorder)

## Documentation / Types
None

## Issues fixed
* Fixed bug where [the blockBreak event](https://oscarnow.github.io/minecraft-server/{version}/classes/Client#on) would not get emitted when the player was in creative mode
* Fixed bug when connecting to the server with a legacy client.
