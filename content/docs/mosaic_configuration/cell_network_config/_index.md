---
title: Cell Simulator – Network Configuration
linktitle: Cell Network Configuration
toc: true
type: docs
draft: false
weight: 105
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

:page_with_curl: **Corresponding configuration file: `cell/network.json`**



---------------------------------------
<a name="reference-network"></a>
## Network

Schema describing the JSON file structure for the network configuration. It is is used to define the properties of the global network. If defined as a number, then the default unit is Gb. Alternatively this can be defined as a string to specify the unit of measurement (e.g. '3 MB').

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|defaultDownlinkCapacity|`integer`<br>`string`|This downlink capacity value will be used for node-specific capacity calculation, if it wasn't set in the cell configuration. If defined as a number, then the default unit is Gb. Alternatively this can be defined as a string to specify the unit of measurement (e.g. '3 MB').|No|None|`100 Gb`|
|defaultUplinkCapacity|`integer`<br>`string`|This uplink capacity value will be used for node-specific capacity calculation, if it wasn't set in the cell configuration.|No|None|`100 Gb`|
|globalNetwork|[`globalNetwork`](#reference-globalnetwork)|Object to define all coverage properties of one region of the radio access network (ran-part). Such a configuration consists of one uplink-module and one downlink-module. In this context, uplink and downlink always refer to the direction TOWARDS and respectively FROM the GEO entity.| &#10003; Yes|None|None|
|servers|[`server`](#reference-server)|List of configured servers.|No|None|None|



---------------------------------------
<a name="reference-globalnetwork"></a>
## globalNetwork

Object to define all coverage properties of one region of the radio access network (ran-part). Such a configuration consists of one uplink-module and one downlink-module. In this context, uplink and downlink always refer to the direction TOWARDS and respectively FROM the GEO entity.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|uplink|[`globalNetwork.uplink`](#reference-globalnetwork.uplink)|Object to define the uplink of a network. The uplink direction only allows point-to-point communication (unicast). It is composed of the three nested models for delay, transmission configuration and capacity.| &#10003; Yes|None|None|
|downlink|[`globalNetwork.downlink`](#reference-globalnetwork.downlink)|Object to define the downlink of a network. The downlink supports two individual paths: Point-to-point communication (unicast) and Point-to-multipoint communication (multicast).| &#10003; Yes|None|None|



---------------------------------------
<a name="reference-globalnetwork-uplink"></a>
## globalNetwork.uplink

Object to define the uplink of a network. The uplink direction only allows point-to-point communication (unicast). It is composed of the three nested models for delay, transmission configuration and capacity.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|delay|[`delay`](#reference-delay)|Object to define a delay model.| &#10003; Yes|None|None|
|transmission|[`transmission`](#reference-transmission)|Object to define the properties of a transmission.| &#10003; Yes|None|None|
|capacity|`integer`<br>`string`|The capacity.| &#10003; Yes|None|None|
|maxCapacity|`number`|The maximal capacity when no transmission is ongoing.|No|None|None|



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
|type|`string`|The type of delay.| &#10003; Yes|Enum[<i class="fas fa-info-circle"></i>](#restriction-gammadelaytype)|None|
|minDelay|`number`<br>`string`|Minimum delay for the Gamma distribution. If defined as a number, then the default unit is ns. Alternatively this can be defined as a string to specify the unit of measurement (e.g. '3 seconds')| &#10003; Yes|None|None|
|expDelay|`number`<br>`string`|Expected delay for the Gamma distribution. If defined as a number, then the default unit is ns. Alternatively this can be defined as a string to specify the unit of measurement (e.g. '3 seconds')| &#10003; Yes|None|None|

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
|type|`string`|The type of delay.| &#10003; Yes|Enum[<i class="fas fa-info-circle"></i>](#restriction-constantdelaytype)|None|
|delay|`number`<br>`string`|The delay. If defined as a number, then the default unit is ns. Alternatively this can be defined as a string to specify the unit of measurement (e.g. '3 seconds')| &#10003; Yes|None|None|

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
|type|`string`|The type of delay.| &#10003; Yes|Enum[<i class="fas fa-info-circle"></i>](#restriction-simplerandomdelaytype)|None|
|steps|`integer`|Number of possible delays between min and max.| &#10003; Yes|[0, +$\infty$]|None|
|minDelay|`number`<br>`string`|Minimum delay in nanoseconds for the Gamma distribution. If defined as a number, then the default unit is ns. Alternatively this can be defined as a string to specify the unit of measurement (e.g. '3 seconds')| &#10003; Yes|None|None|
|maxDelay|`number`<br>`string`|Maximum delay in nanoseconds for the Gamma distribution. If defined as a number, then the default unit is ns. Alternatively this can be defined as a string to specify the unit of measurement (e.g. '3 seconds')| &#10003; Yes|None|None|

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
|lossProbability|`number`|Probability of packet retransmission (in case of configured retries > 0) or packet loss (retries = 0) for the packet retransmission/loss model. A value of 0 equals a lossfree transmission.| &#10003; Yes|[0, 1]|None|
|maxRetries|`integer`|Maximum Number of retransmissions.|No|[0, +$\infty$]|`0`|



---------------------------------------
<a name="reference-globalnetwork-downlink"></a>
## globalNetwork.downlink

Object to define the downlink of a network. The downlink supports two individual paths: Point-to-point communication (unicast) and Point-to-multipoint communication (multicast).

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|unicast|[`unicast`](#reference-unicast)|Point-to-point communication (unicast).| &#10003; Yes|None|None|
|multicast|[`multicast`](#reference-multicast)|Point-to-multipoint communication (multicast).| &#10003; Yes|None|None|
|capacity|`integer`<br>`string`|Shared capacity between unicast and multicast.| &#10003; Yes|None|None|



---------------------------------------
<a name="reference-unicast"></a>
## unicast

Point-to-point communication (unicast).

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|delay|[`delay`](#reference-delay)|Object to define a delay model.| &#10003; Yes|None|None|
|transmission|[`transmission`](#reference-transmission)|Object to define the properties of a transmission.| &#10003; Yes|None|None|



---------------------------------------
<a name="reference-multicast"></a>
## multicast

Point-to-multipoint communication (multicast).

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|delay|[`delay`](#reference-delay)|Object to define a delay model.| &#10003; Yes|None|None|
|transmission|[`transmission`](#reference-transmission)|Object to define the properties of a transmission.| &#10003; Yes|None|None|
|usableCapacity|`number`|The usableCapacity configures the ratio of the overall downlink capacity allowed to be used.| &#10003; Yes|[0, 1]|None|



---------------------------------------
<a name="reference-server"></a>
## server



**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|id|`string`|Network-Id for identification.| &#10003; Yes|None|None|
|uplink|[`server.uplink`](#reference-server.uplink)|Object to define uplink properties of a network. The uplink direction only allows point-to-point communication (unicast). It is composed of the three nested models for delay, transmission configuration and capacity.|No|None|None|
|downlink|[`server.downlink`](#reference-server.downlink)||No|None|None|

**The following additional properties are allowed:**  
* [undefined](#reference-undefined) 



---------------------------------------
<a name="reference-server-uplink"></a>
## server.uplink

Object to define uplink properties of a network. The uplink direction only allows point-to-point communication (unicast). It is composed of the three nested models for delay, transmission configuration and capacity.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|delay|[`delay`](#reference-delay)|Object to define a delay model.| &#10003; Yes|None|None|
|transmission|[`transmission`](#reference-transmission)|Object to define the properties of a transmission.| &#10003; Yes|None|None|

**The following additional properties are allowed:**  
* [undefined](#reference-undefined) 



---------------------------------------
<a name="reference-server-downlink"></a>
## server.downlink

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|unicast|[`unicast`](#reference-unicast)|Point-to-point communication (unicast).| &#10003; Yes|None|None|

**The following additional properties are allowed:**  
* [undefined](#reference-undefined) 

