---
title: Cell Simulator – Region Configuration
linktitle: Cell Region Configuration
toc: true
type: docs
draft: false
weight: 106
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

:page_with_curl: **Corresponding configuration file: `cell/regions.json`**



---------------------------------------
<a name="reference-regions"></a>
## Regions

Schema describing the JSON file structure for the regional networks configuration. It is is used to extend the network with regional information, which enables the emulation of mobile networks. If configured very granular, these regions can reflect cells as used in the real world. Though for most use-cases it is sufficient to approximate the behaviour by defining larger regions.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|regions|[`mobileNetworkProperties[]`](#reference-mobilenetworkproperties)|An array of regional network configruations.|No|None|None|



---------------------------------------
<a name="reference-mobilenetworkproperties"></a>
## mobileNetworkProperties

Object to define a network with specific geograpgical extensions. It applies for all regions except the global network, which covers the remaining space. The CMobileNetworkProperties only needs to be employed, when geographic information are accessed.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|id|`string`|Network-Id for identification.|No|None|None|
|area|[`geoRectangle`](#reference-georectangle)|Object to define an immutable pair of two different geoPoints. Together they form a rectangular area.| &#10003; Yes|None|None|
|polygon|`object`|The area of the network as a polygon.| &#10003; Yes|None|None|
|uplink|[`mobileNetworkProperties.uplink`](#reference-mobilenetworkproperties.uplink)|Object to define the uplink of a network. The uplink direction only allows point-to-point communication (unicast). It is composed of the three nested models for delay, transmission configuration and capacity.| &#10003; Yes|None|None|
|downlink|[`mobileNetworkProperties.downlink`](#reference-mobilenetworkproperties.downlink)|Object to define the downlink of a network. The downlink supports two individual paths: Point-to-point communication (unicast) and Point-to-multipoint communication (multicast).| &#10003; Yes|None|None|



---------------------------------------
<a name="reference-georectangle"></a>
## geoRectangle

Object to define an immutable pair of two different geoPoints. Together they form a rectangular area.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|nw|[`geoPoint`](#reference-geopoint)|Object to define geographical point coordinates.| &#10003; Yes|None|None|
|se|[`geoPoint`](#reference-geopoint)|Object to define geographical point coordinates.| &#10003; Yes|None|None|



---------------------------------------
<a name="reference-geopoint"></a>
## geoPoint

Object to define geographical point coordinates.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|lon|`number`|East-west position of a point on earth.| &#10003; Yes|[-180, 180]|None|
|lat|`number`|North-south position of a point on earth.| &#10003; Yes|[-$\infty$, 90]|None|



---------------------------------------
<a name="reference-mobilenetworkproperties-uplink"></a>
## mobileNetworkProperties.uplink

Object to define the uplink of a network. The uplink direction only allows point-to-point communication (unicast). It is composed of the three nested models for delay, transmission configuration and capacity.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|delay|[`delay`](#reference-delay)|Object to define a delay model.| &#10003; Yes|None|None|
|transmission|[`transmission`](#reference-transmission)|Object to define the properties of a transmission.| &#10003; Yes|None|None|
|capacity|`integer`<br>`string`|The capacity of the uplink.| &#10003; Yes|None|None|



---------------------------------------
<a name="reference-delay"></a>
## delay

Object to define a delay model.

**Additionally ONE of the following property definitions apply:**  
* [gammaDelay](#reference-gammaDelay) 
* [constantDelay](#reference-constantDelay) 
* [simpleRandomDelay](#reference-simpleRandomDelay) 



---------------------------------------
<a name="reference-gammadelay"></a>
## gammaDelay

Object to define a model for GammaRandomDelay or GammaSpeedDelay. GammaRandomDelay bases directly on the Gamma distribution (b=2,p=2) with minimum and expected value. Due to the nature of the Gamma distribution, the resulting delays can be far higher than the expected value. GammaSpeedDelay bases on the GammaRandomDelay and includes an additional speed penalty according to the current speed of the vehicle.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|type|`string`|Type of Gamma delay.| &#10003; Yes|Enum[<i class="fas fa-info-circle"></i>](#restriction-gammadelaytype)|None|
|minDelay|`number`<br>`string`|Minimum delay for the Gamma distribution. If defined as a number, then the default unit is ns. Alternatively this can be defined as a string to include the unit of measurement (e.g. '3 seconds')| &#10003; Yes|None|None|
|expDelay|`number`<br>`string`|Expected delay for the Gamma distribution. If defined as a number, then the default unit is ns. Alternatively this can be defined as a string to include the unit of measurement (e.g. '3 seconds')| &#10003; Yes|None|None|

**Further property restrictions:**  
<a name="restriction-gammadelaytype"></a> 
### gammaDelay.type

* **Allowed values**:
   * `GammaRandomDelay`
   * `GammaSpeedDelay`


---------------------------------------
<a name="reference-constantdelay"></a>
## constantDelay

Object to define a model for constant delay, which delivers always the same delay.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|type|`string`|Type of the constant delay| &#10003; Yes|Enum[<i class="fas fa-info-circle"></i>](#restriction-constantdelaytype)|None|
|delay|`number`<br>`string`|The delay, given in ns if defined as a number. Alternatively this can be defined as a string to include the unit of measurement (e.g. '3 seconds')| &#10003; Yes|None|None|

**Further property restrictions:**  
<a name="restriction-constantdelaytype"></a> 
### constantDelay.type

* **Allowed values**:
   * `ConstantDelay`


---------------------------------------
<a name="reference-simplerandomdelay"></a>
## simpleRandomDelay

Object to define a model for a radnomised delay. Delivers number-of-steps different uniformly distributed delays in the interval defined by min and max (e.g. minDelay=30ms, maxDelay=60ms, steps=4 -> possible delays={30,40,50,60}ms.).

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|type|`string`|Type of the delay.| &#10003; Yes|Enum[<i class="fas fa-info-circle"></i>](#restriction-simplerandomdelaytype)|None|
|steps|`integer`|Number of possible delays between min and max.| &#10003; Yes|[0, +$\infty$]|None|
|minDelay|`number`<br>`string`|Minimum delay in nanoseconds for the Gamma distribution. If defined as a number, then the default unit is ns. Alternatively this can be defined as a string to include the unit of measurement (e.g. '3 seconds')| &#10003; Yes|None|None|
|maxDelay|`number`<br>`string`|Maximum delay in nanoseconds for the Gamma distribution. If defined as a number, then the default unit is ns. Alternatively this can be defined as a string to include the unit of measurement (e.g. '3 seconds')| &#10003; Yes|None|None|

**Further property restrictions:**  
<a name="restriction-simplerandomdelaytype"></a> 
### simpleRandomDelay.type

* **Allowed values**:
   * `SimpleRandomDelay`


---------------------------------------
<a name="reference-transmission"></a>
## tranmission

Object to define the properties of a transmission.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|lossProbability|`number`|Probability of packet retransmission (in case of configured retries > 0) or packet loss (retries = 0) for the packet retransmission/loss model. A value of 0 equals a lossfree transmission.| &#10003; Yes|[0, 1]|`0`|
|maxRetries|`integer`|Maximum Number of retransmissions.|No|[0, +$\infty$]|None|



---------------------------------------
<a name="reference-mobilenetworkproperties-downlink"></a>
## mobileNetworkProperties.downlink

Object to define the downlink of a network. The downlink supports two individual paths: Point-to-point communication (unicast) and Point-to-multipoint communication (multicast).

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|unicast|[`unicast`](#reference-unicast)|Object to define point-to-point communication.| &#10003; Yes|None|None|
|multicast|[`multicast`](#reference-multicast)|Object to define point-to-multipoint communication.| &#10003; Yes|None|None|
|capacity|`integer`<br>`string`|The capacity of the downlink.| &#10003; Yes|None|None|



---------------------------------------
<a name="reference-unicast"></a>
## unicast

Object to define point-to-point communication.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|delay|[`delay`](#reference-delay)|Object to define a delay model.| &#10003; Yes|None|None|
|transmission|[`transmission`](#reference-transmission)|Object to define the properties of a transmission.| &#10003; Yes|None|None|



---------------------------------------
<a name="reference-multicast"></a>
## multicast

Object to define point-to-multipoint communication.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|delay|[`delay`](#reference-delay)|Object to define a delay model.| &#10003; Yes|None|None|
|transmission|[`transmission`](#reference-transmission)|Object to define the properties of a transmission.| &#10003; Yes|None|None|
|usableCapacity|`number`|The usableCapacity configures the ratio of the overall downlink capacity allowed to be used.| &#10003; Yes|[0, 1]|None|

