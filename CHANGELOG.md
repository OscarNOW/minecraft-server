## Existing API changes
None

## New API
* [<Server>.on('listening', () => { })](https://oscarnow.github.io/minecraft-server/1.4.0/classes/Server#on)
* [<Client>.entity('experience_orb', ...)](https://oscarnow.github.io/minecraft-server/1.4.0/classes/Client#entity.entity-2)
* [<Client>.blocks](https://oscarnow.github.io/minecraft-server/1.4.0/classes/Client#blocks)
* [previousBlock argument in <Client>.on('blockBreak', location, previousBlock)](https://oscarnow.github.io/minecraft-server/1.4.0/classes/Client#on)

* [<Client>.acknowledgeBlockBreak](https://oscarnow.github.io/minecraft-server/1.4.0/classes/Client#acknowledgeBlockBreak)
* [<Client>.acknowledgeAcknowledgeDigCancel](https://oscarnow.github.io/minecraft-server/1.4.0/classes/Client#acknowledgeDigCancel)
* [<Client>.acknowledgeAcknowledgeDigStart](https://oscarnow.github.io/minecraft-server/1.4.0/classes/Client#acknowledgeDigStart)

* [WorldBorder](https://oscarnow.github.io/minecraft-server/1.4.0/classes/WorldBorder)
* [<Client>.worldBorder](https://oscarnow.github.io/minecraft-server/1.4.0/classes/Client#worldBorder)

## Issues fixed
* Fixed bug where [the blockBreak event](https://oscarnow.github.io/minecraft-server/1.4.0/classes/Client#on) would not get emitted when the player was in creative mode
* Fixed bug when connecting to the server with a legacy client.

## Documentation / Types
* Updated the Readme with better language
* Fixed the imports of the FAQ
* Added descriptions to some functions and parameters