## Existing API changes
None

## New API
* Added [`<Chunk>.hash`](https://oscarnow.github.io/minecraft-server/1.2.0/classes/Chunk#hash)
* Added [`<Client>.locale.serious`](https://oscarnow.github.io/minecraft-server/1.2.0/classes/Client#locale)

## Speed improvements
* Loading library
* Generating chunks
* Connecting a client to the server

## Issues fixed
* Fixed bug in `<Client>.end()`
* Fixed bug where responses to legacy pings weren't being defaulted
* Fixed issue where Client settings where all null

## Documentation / Types
* Docs list unstable versions before stable versions
* Made [`<Client>.locale` properties](https://oscarnow.github.io/minecraft-server/1.20/classes/Client#locale) explicit instead of `string`