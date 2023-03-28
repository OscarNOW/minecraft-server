## Existing API changes
None

## New API
* [<Server>.on('listening', () => { })](https://oscarnow.github.io/minecraft-server/{version}/classes/Server#on)
* [<Client>.entity('experience_orb', ...)](https://oscarnow.github.io/minecraft-server/{version}/classes/Client#entity.entity-2)

* [<Client>.acknowledgeBlockBreak](https://oscarnow.github.io/minecraft-server/github/classes/Client#acknowledgeBlockBreak)
* [<Client>.acknowledgeAcknowledgeDigCancel](https://oscarnow.github.io/minecraft-server/github/classes/Client#acknowledgeDigCancel)
* [<Client>.acknowledgeAcknowledgeDigStart](https://oscarnow.github.io/minecraft-server/github/classes/Client#acknowledgeDigStart)

* [WorldBorder](https://oscarnow.github.io/minecraft-server/{version}/classes/WorldBorder)
* [<Client>.worldBorder](https://oscarnow.github.io/minecraft-server/{version}/classes/Client#worldBorder)

## Documentation / Types
None

## Issues fixed
* Fixed bug when connecting to the server with a legacy client.
