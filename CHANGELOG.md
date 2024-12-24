## Existing API changes
* `<Client>.cooldown(` now uses seconds instead of ticks for consistency
* A `<Server>.listen(` call is required for the server to start listening
* Text arrayComponent `hoverEvent` is changed to `hoverText`
* When setting `<Client>.food`, the new value is now strictly checked
* When setting `<Client>.foodSaturation`, the new value is now strictly checked
* When setting `<Client>.slot`, the new value is now strictly checked
* When setting `<Client>.health`, the new value is now strictly checked
* When passing incorrect values to functions (or when setting variables), they will now throw instead of using `CustomError`
* Removed `<Client>.window()` as it was not yet implemented

## New API
* `<Client>.statistics` (which is changeable) which sets the Client statistics
* `statisticsOpen` event for Client, which triggers when the Client opens the statistics menu

## Code issues fixed
* Improved bugs in defaultClientProperties
* Added skinAccountUuid to Client (and Client.skinAccountUuid)
* Optimized the Text packet output to be smaller
* Fixed a Text bug where colors would be discarded inside a translate array component when converted to a string

## Updated dependencies
None

## Non-code issues fixed
None