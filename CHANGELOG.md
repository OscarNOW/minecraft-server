## Existing API changes
None

## New API
None

## Code issues fixed
* Fixed bug with serverList correct version
* Added cache in getBlockStateId
* Added extra user input checks with errors
* Fixed bug where code would crash if return from serverList is not an object when responding to a legacy ping
* Fixed wrongVersionConnect to display version name
* Fixed bug when version name is an empty string

## Updated dependencies
* Updated `minecraft-protocol` to `1.43.1` (minor)
* Updated `mineflayer` to `4.10.0` (minor)
* Updated `eslint` to `8.44.0` (minor)

## Non-code issues fixed
* Improved and fixed examples