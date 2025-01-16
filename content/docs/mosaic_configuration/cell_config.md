---
title: Cell Simulator – Basic Configuration
linktitle: Cell Basic
toc: true
type: docs
draft: false
weight: 104
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

<span class="page_with_curl">:page_with_curl:</span> **Corresponding configuration file: `cell/cell_config.json`**



---------------------------------------
<a name="reference-cell"></a>
## Cell

This schema describes the JSON file structure for the cell configuration, which provides general configuration for the ambassador, such as paths to the regions and network configuration files.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|bandwidthMeasurementInterval|`number`|Interval in which the bandwidth is aggregated, given in seconds.|No|[1, +$\infty$]|`1`|
|bandwidthMeasurementCompression|`boolean`|If enabled, the export files with bandwidth measurements will be compressed using gzip compression.|No|None|`false`|
|networkConfigurationFile|`string`|Relative path to the network configuration file.| &#10003; Yes|None|`network.json`|
|regionConfigurationFile|`string`|Relative path to the region configuration file.|No|None|`regions.json`|
|bandwidthMeasurements|[`bandwidthMeasurement[]`](#reference-bandwidthmeasurement)|Measure the bandwidth between regions.|No|None|None|



---------------------------------------
<a name="reference-bandwidthmeasurement"></a>
## bandwidthMeasurement

Object to define the bandwidth measurement between regions.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|fromRegion|`string`|Measure the bandwidth of messages which originate in this region (use wildcard * for all regions).| &#10003; Yes|None|None|
|toRegion|`string`|Measure the bandwidth of messages which target in this region (use wildcard * for all regions).| &#10003; Yes|None|None|
|transmissionMode|`string`|Defines the transmission mode which is observed.| &#10003; Yes|Enum[<i class="fas fa-info-circle"></i>](#restriction-bandwidthmeasurementtransmissionmode)|None|
|applicationClass|`string`|The application Class.|No|None|`*`|

**Further property restrictions:**  
<a name="restriction-bandwidthmeasurementtransmissionmode"></a> 
### bandwidthMeasurement.transmissionMode

* **Allowed values**:
   * `UplinkUnicast`
   * `DownlinkUnicast`
   * `DownlinkMulticast`
