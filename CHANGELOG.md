## Existing API changes
* Removed `<Client>.observe(` in favor of `<Client>.on('change', ...`

## New API
* [`<Client>.removeAllListeners(`](https://oscarnow.github.io/minecraft-server/1.0.0/classes/Client#removeAllListeners)
* Added [`Boat`](https://oscarnow.github.io/minecraft-server/1.0.0/classes/Boat) class

## Issues fixed
* Now, if the client doesn't respond to keep alive packets or doesn't send a teleport confirmation packet, we sent [the misbehavior event](https://oscarnow.github.io/minecraft-server/1.0.0/classes/Client#on.on-10).

## Documentation / Types
* Changed `entityType` type to [`entityName`](https://oscarnow.github.io/minecraft-server/1.0.0/types/entityName)
* Fixed return type for [`<Client>.entity(`](https://oscarnow.github.io/minecraft-server/1.0.0/classes/Client#entity)
* Fixed title in doc pages to include `docs`
* Added `unstable` get parameter to documentation redirect links