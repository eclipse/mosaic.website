---
title: SNS Configuration
linktitle: SNS Configuration
toc: true
type: docs
draft: false
weight: 102
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



---------------------------------------
<a name="reference-csnsscheme"></a>
## CSnsScheme

Schema describing the JSON file structure for the sns configuration.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|maximumTtl|`integer`|The threshold for the amount of hops for a transmission. This is an additional, hard threshold, which can't be exceeded.|No|[0, +$\infty$]|`10`|
|singlehopRadius|`number`|Default radius in m to be used if an AdhocConfiguration doesn't specify a radius.|No|None|`509.4`|
|adhocTransmissionModel|[`adhocTransmissionModel`](#reference-adhoctransmissionmodel)|Object to define an adhoc transimssion model.|No|None|None|
|singlehopDelay|[`delay`](#reference-delay)|Object to define a delay model.|No|None|[constantDelay](#reference-constantdelay)|
|singlehopTransmission|[`transmission`](#reference-transmission)|Object to define the properties of a transmission.| &#10003; Yes|None|None|



---------------------------------------
<a name="reference-adhoctransmissionmodel"></a>
## adocTransmissionModel

Object to define an adhoc transimssion model.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|type|`string`|Type of the transmission model. The simple model assumes, that all receivers can be reached even though this might not be the case in reality.|No|Enum[<i class="fas fa-info-circle"></i>](#restriction-adoctransmissionmodeltype)|None|
|simpleMultihopDelay|[`delay`](#reference-delay)|Object to define a delay model.|No|None|[constantDelay](#reference-constantdelay)|
|simpleMultihopTransmission|[`transmission`](#reference-transmission)|Object to define the properties of a transmission.| &#10003; Yes|None|None|

**Further property restrictions:**  
<a name="restriction-adhoctransmissionmodeltype"></a> 
### adhocTransmissionModel.type

* **Allowed values**:
   * `SimpleAdhocTransmissionModel`
   * `SophisticatedAdhocTransmissionModel`


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
|delay|`number`<br>`string`|The delay. If defined as a number, then the default unit is ns. Alternatively this can be defined as a string to include the unit of measurement (e.g. '3 seconds')| &#10003; Yes|None|None|

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

