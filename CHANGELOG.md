## Existing API changes
None

## New API
* Added [`<Chunk>.hash`](https://oscarnow.github.io/minecraft-server/1.2.0/classes/Chunk#hash)
* Added `oldValue` argument to [`Client change event`](https://oscarnow.github.io/minecraft-server/1.2.0/classes/Client#on)
* Added [`<Client>.locale.serious`](https://oscarnow.github.io/minecraft-server/1.2.0/classes/Client#locale)
* [`<Client>.tabHeader`](https://oscarnow.github.io/minecraft-server/1.2.0/classes/Client#tabHeader)
* [`<Client>.tabFooter`](https://oscarnow.github.io/minecraft-server/1.2.0/classes/Client#tabFooter)
* [`<Client>.die(`](https://oscarnow.github.io/minecraft-server/1.2.0/classes/Client#die)
* [`<Entity>.killClient(`](https://oscarnow.github.io/minecraft-server/1.2.0/classes/Entity#killClient)
* [`<LoadedChunk>.remove(`](https://oscarnow.github.io/minecraft-server/1.2.0/classes/LoadedChunk#remove)

## Speed improvements
* Loading library
* Generating chunks
* Creating a server
* Connecting a client to the server
* Accessing [`<Client>.chunks`](https://oscarnow.github.io/minecraft-server/1.2.0/classes/Client#chunks)

## Documentation / Types
* Docs list unstable versions before stable versions
* Made [`<Client>.locale` properties](https://oscarnow.github.io/minecraft-server/1.20/classes/Client#locale) explicit instead of `string`

## Issues fixed
* Fixed bug in [`<Client>.end()`](https://oscarnow.github.io/minecraft-server/1.2.0/classes/Client#end)
* Fixed bug where responses to legacy pings weren't being defaulted
* Fixed bug where Client settings where all null
* Fixed bug where Client could get kicked if you set the yaw or pitch of an Entity to high or low
* Fixed bug where [`<Client>.chunks`](https://oscarnow.github.io/minecraft-server/1.2.0/classes/Client#chunks) was sometimes `undefined`
* Fixed bug where [`<Client>.entity(`](https://oscarnow.github.io/minecraft-server/1.2.0/classes/Client#entity) would crash