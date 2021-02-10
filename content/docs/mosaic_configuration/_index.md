---
title: Eclipse MOSAIC Simulation Configuration
linktitle: Simulation Configuration
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 10
menu:
  docs:
    parent: mosaic_configuration
---

On the following pages we provide a complete documentation of configuration files. 

## Readable Units
Our configurations except readable units. If a type of our configuration files can be of type `number` or `string`, you
can write a number which then will be interpreted as the type as described in the documentation. Otherwise, you are able
to input a readable text like e.g. `"10 km"` or `"35 mph"` which than will be calculated automatically in the default
unit. Following, you find a few examples:  

<style>
table {
width: auto;
min-width: 65%;
}
</style>

|               | Input         | Converted Input     | Default Unit |
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