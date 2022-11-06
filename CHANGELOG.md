## Existing API changes
* Removed `<Client>.observe(` in favor of `<Client>.on('change', ...`

## New API
* [`<Client>.removeAllListeners(`](https://oscarnow.github.io/minecraft-server/1.0.0/classes/Client#removeAllListeners)

## Issues fixed
* Now, if the client doesn't respond to keep alive packets or doesn't send a teleport confirmation packet, we sent [the misbehavior event](https://oscarnow.github.io/minecraft-server/1.0.0/classes/Client#on.on-10).

## Documentation / Types
* Changed `entityType` type to [`entityName`](https://oscarnow.github.io/minecraft-server/1.0.0/types/legacyVersion)
* Added `unstable` get parameter to documentation redirect links