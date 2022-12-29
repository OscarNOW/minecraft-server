## Existing API changes
None

## New API
* Added [`<Chunk>.hash`](https://oscarnow.github.io/minecraft-server/1.2.0/classes/Chunk#hash)
* Added [`<Client>.locale.serious`](https://oscarnow.github.io/minecraft-server/1.2.0/classes/Client#locale)
* Added `oldValue` argument to [`Client change event`](https://oscarnow.github.io/minecraft-server/1.2.0/classes/Client#on)

## Speed improvements
* Loading library
* Generating chunks
* Creating a server
* Connecting a client to the server

## Issues fixed
* Fixed bug in [`<Client>.end()`](https://oscarnow.github.io/minecraft-server/1.2.0/classes/Client#end)
* Fixed bug where responses to legacy pings weren't being defaulted
* Fixed bug where Client settings where all null
* Fixed bug where Client could get kicked if you set the yaw or pitch of an Entity to high or low
* Fixed bug where [`<Client>.chunks`](https://oscarnow.github.io/minecraft-server/1.2.0/classes/Client#chunks) was sometimes `undefined`

## Documentation / Types
* Docs list unstable versions before stable versions
* Made [`<Client>.locale` properties](https://oscarnow.github.io/minecraft-server/1.20/classes/Client#locale) explicit instead of `string`