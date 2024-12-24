## Existing API changes
* `<Client>.cooldown(` now uses seconds instead of ticks for consistency
* A `<Server>.listen(` call is required for the server to start listening
* Text arrayComponent `hoverEvent` is changed to `hoverText`

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