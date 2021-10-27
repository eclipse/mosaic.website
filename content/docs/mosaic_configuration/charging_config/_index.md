---
title: Charging Configuration
linktitle: Charging Configuration
toc: true
type: docs
draft: false
weight: 109
menu:
  docs:
    parent: mosaic_configuration
---

{{% alert tip %}}
You can use a {{< link title="Readable Unit" href="/docs/mosaic_configuration/#readable-units">}} anywhere where you
have the option of:
- `number` **or** `string`
- `integer` **or** `string`
{{% /alert %}}

---

:page_with_curl: **Corresponding configuration file: `charging/charging_config.json`**



---------------------------------------
<a name="reference-chargingstationambassador-configuration"></a>
## ChargingStationAmbassador configuration

Schema describing the JSON file structure for the ChargingStationAmbassador configuration.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|chargingStationRange|[`any`](#reference-any)|The maximal range in meters a vehicle can be away from a charging station, in order to charge at the station.|No|None|None|

