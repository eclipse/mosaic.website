---
title: Eclipse MOSAIC Configuration Files
linktitle: Configuration Files
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 10
menu:
  docs:
    parent: mosaic_configuration
---

On the following pages we provide a complete documentation of configuration files:

| Configuration File  | Documentation |
| --------------------|---------------|
|  `scenario_config.json` | [Scenario Configuration](scenario_config) |
|  `mapping/mapping_config.json` | [Mapping Configuration](mapping_ambassador_config) |
|  `environment/environment_config.json` | [Environment Simulator Configuration](environment_config) |
|  `sns/sns_config.json` | [SNS Configuration](sns_config) |
|  `cell/cell_config.json` | [Cell Simulator configuration](cell_config) |
|  `cell/regions.json` | [Cell Regions configuration](cell_region_config) |
|  `cell/network.json` | [Cell Network configuration](cell_network_config) |
|  `sumo/sumo_config.json` | [SUMO Ambassador Configuration](sumo_config)|
| | |
|  `battery/battery_config.json` | [Battery Simulator Configuration](battery_config) (_Extended_)|
|  `charging/charging_config.json` | [Charging Simulator Configuration](charging_config) (_Extended_)|

### Readable Units
Our configuration files accept readable units for some fields. 
If a field or attribute can be filled with values of type `number` or `string` (e.g. the `maxSpeed` of a vehicle in the Mapping configuration), 
you can write a number which then will be interpreted as the type as described in the documentation. Besides, you are able
to input a readable text like e.g. `"10 km"` or `"35 mph"` which than will be converted automatically to the default
unit. Following, you find a few examples:  

<style>
table {
width: auto;
min-width: 65%;
}
</style>

|               | String Input  | Number Input        | Default Unit |
|---------------|---------------|---------------------|--------------|
| **Distance**  |               |                     |              |  
|               | `"10 km"`     | `10000.0`           | `m`          |
|               | `"10 cm"`     | `0.1`               | `m`          |
|               | `"0.5m"`      | `0.5`               | `m`          |
|               | `"1 meter"`   | `1.0`               | `m`          |
| **Speed**     |               |                     |              |  
|               | `"10 km/h"`   | `2.77`              | `m/s`        |
|               | `"10 m/s"`    | `10.0`              | `m/s`        |
|               | `"35 mph"`    | `15.6464`           | `m/s`        |
| **Time**      |               |                     |              |  
|               | `"10 ms"`     | `10_000_000`        | `ns`         |
|               | `"20 ns"`     | `20`                | `ns`         |
|               | `"0.5h"`      | `1_800_000_000_000` | `ns`         |
|               | `"0.5 hours"` | `1_800_000_000_000` | `ns`         |

{{% alert note %}}
The dashes `_` in e.g. `1_800_000_000_000` are only used for better readability in this documentation.
{{% /alert %}}