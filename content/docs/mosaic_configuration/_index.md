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

| Simulator/Ambassador | Configuration File  | Documentation |
| ---------------------|---------------------|-------------|
| {{< link title="Mapping" href="/docs/simulators/application_simulator/#eclipse-mosaic-mapping" >}} | `mapping/mapping_config.json` | > {{< link title="Mapping Configuration" href="/docs/mosaic_configuration/mapping_ambassador_config" >}} |
| {{< link title="Environment" href="/docs/simulators/environment_simulator" >}} | `environment/environment_config.json` | > {{< link title="Environment Simulator Configuration" href="/docs/mosaic_configuration/environment_config" >}} |
| {{< link title="Simple Network Simulator" href="/docs/simulators/network_simulator_sns" >}} | `sns/sns_config.json` | > {{< link title="SNS Configuration" href="/docs/mosaic_configuration/sns_config" >}} |
| {{< link title="Cell" href="/docs/simulators/network_simulator_cell" >}} | `cell/regions.json` | > {{< link title="Regions configuration" href="/docs/mosaic_configuration/cell_region_config" >}} |
| {{< link title="Cell" href="/docs/simulators/network_simulator_cell" >}} | `cell/network.json` | > {{< link title="Network configuration" href="/docs/mosaic_configuration/cell_network_config" >}} |
| {{< link title="SUMO" href="/docs/simulators/traffic_simulator_sumo" >}} | `sumo/sumo_config.json` | > {{< link title="SUMO Ambassador Configuration" href="/docs/mosaic_configuration/sumo_config" >}} |

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