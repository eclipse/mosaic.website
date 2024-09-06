---
title: Scenario-Convert Tool
linktitle: Scenario-Convert Tool
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 20
menu:
  docs:
    parent: scenarios
---

{{% alert note %}}
**scenario-convert** does not belong do the open-source part of Eclipse MOSAIC and must be obtained separately.

Yet, you can use scenario-convert **for free** to generate scenarios which are executable with Eclipse MOSAIC. **[Get it here](https://www.dcaiti.tu-berlin.de/research/simulation/download/).**
{{% /alert %}}

{{< button icon="download" type="primary" link="https://www.dcaiti.tu-berlin.de/research/simulation/download/" title="Download scenario-convert from DCAITI mirror" >}}

1. **Download the `scenario-convert-{{< version of="mosaic" >}}.zip/tar.gz` bundle from the mirror above.**
2. Extract the package to an arbitrary path. It is recommended to extract the package in the very same directory as MOSAIC (`<mosaic-root>`).
3. Use the call `scenario-convert.bat/sh` on the command line to execute the tool.

## Usage of scenario-convert

{{% alert note %}}
The [Create a new Scenario Tutorial](/tutorials/create_new_scenario) provides a detailed introduction to the scenario-convert tool.
{{% /alert %}}

The following listing shows an overview for the usage of scenario-convert:

```
{{< include_file path="files/ScenarioConvertFunctions.txt" >}}
```

## Configuration-files for scenario-convert

Scenario-convert offers a way to safe your conversion-parameters in a `JSON` configuration file using
the option `-c` or `--config-file`.  
The following listing shows how to save the options used in the example above:

```
{{< include_file path="files/steglitz_config.json" >}}
```

## Speed-files
Below you can find a properties file which can be used during the import of OSM data
in order to define speeds for ways, which do not have a maxspeeds-tag defined. For this purpose use the
option `--osm-speeds-file <FILE>`. In the speed properties file, for each way type a speed value can
be defined, according to the OSM [`highway`](http://wiki.openstreetmap.org/wiki/Key:highway) key.

```
{{< include_file path="files/car-speeds.properties" >}}
```
