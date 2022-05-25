---
title: Battery Configuration
linktitle: Battery Configuration
toc: true
type: docs
draft: false
weight: 108
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

<span class="page_with_curl">:page_with_curl:</span> **Corresponding configuration file: `battery/battery_config.json`**



---------------------------------------
<a name="reference-batteryambassador-configuration"></a>
## BatteryAmbassador configuration

Schema describing the JSON file structure for the BatteryAmbassador configuration.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|defaultVehicleModel|[`vehicleModel`](#reference-vehiclemodel)|Vehicle model specifying relevant attributes for battery simulation.| &#10003; Yes|None|[simpleVehicleModel](#reference-simplevehiclemodel)|
|defaultBatteryModel|[`batteryModel`](#reference-batterymodel)|Battery model specifying relevant attributes for battery simulation.| &#10003; Yes|None|[simpleBatteryModel](#reference-simplebatterymodel)|
|environmentModel|[`environmentModel`](#reference-environmentmodel)|The model of the environment to be applied.|No|None|None|
|vehicleModelMap|`object`|Map containing simulated vehicle prototypes assigned to vehicle models.|No|None|None|
|batteryModelMap|`object`|Map containing simulated vehicle prototypes assigned to battery models.|No|None|None|

**Further property restrictions:**  
<a name="restriction-batteryambassadorconfigurationvehiclemodelmap"></a> 
### BatteryAmbassador configuration.vehicleModelMap

* **Type of each property**: vehicleModelMap
<a name="restriction-batteryambassadorconfigurationbatterymodelmap"></a> 
### BatteryAmbassador configuration.batteryModelMap

* **Type of each property**: batteryModelMap


---------------------------------------
<a name="reference-vehiclemodel"></a>
## vehicleModel

Vehicle model specifying relevant attributes for battery simulation.

**Additionally ONE of the following property definitions apply:**  
* [simpleVehicleModel](#reference-simpleVehicleModel) 



---------------------------------------
<a name="reference-simplevehiclemodel"></a>
## simpleVehicleModel

Simple vehicle model, pre-configured with attributes of an electric Smart.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|type|`string`|Type attribute for the type adapter.|No|None|None|
|vehicleMass|`number`<br>`string`|The vehicle mass in kg. It is depending on the number of passengers and the payload of the vehicle.|No|None|None|
|referenceArea|`number`|The reference area of the vehicle in m^2. The reference area is the frontal area of a vehicle. This value is important for the computation of the drag. It can change with modifications of the vehicle (e.g. roof box).|No|[0.1, +$\infty$]|`1.95`|
|dragCoefficient|`number`|The drag coefficient of the vehicle. It is a dimensionless value that is vehicle specific and important for the calculation of the current drag. It can change with modifications of the vehicle (e.g. roof box).|No|[0.1, +$\infty$]|`0.375`|
|tankToWheelEfficiency|`number`|The tank to wheel efficiency (TTW) of the vehicle. It is a dimensionless value that describes the power ratio of the power that is obtained from the battery and the actual power at the wheels. The value includes the efficiency of the electric motor and the efficiency of the drive train.|No|[0, 1]|`0.7`|
|electricMotorOperatingVoltage|`number`<br>`string`|The operating voltage of the electric motor in V. It is needed to calculate the actual electric current that is obtained from the battery by the electric motor.|No|None|None|
|consumerOperatingVoltage|`number`<br>`string`|The operating voltage of regular electric consumers in the vehicle in V (e.g. radio, ISO 4165 adapter). It is needed to calculate the actual electric current that is obtained by these consumers.|No|None|None|
|recuperationEfficiency|`number`|The efficiency of the recuperation process. This is a dimensionless value in the range of 0 to 1.|No|[0, 1]|`1`|
|maxRecuperationPower|`number`|The maximum power that can be gained from recuperation process.|No|[0, +$\infty$]|`60000`|
|electricConsumers|[`electricConsumer[]`](#reference-electricconsumer)||No|None|None|



---------------------------------------
<a name="reference-electricconsumer"></a>
## electricConsumer

Definition of additional electric consumers putting load on the vehicles' battery.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|name|`string`|Name of the consumer.|No|None|None|
|power|`number`|Power the consumer uses. [W]|No|[0.01, +$\infty$]|None|



---------------------------------------
<a name="reference-batterymodel"></a>
## batteryModel

Battery model specifying relevant attributes for battery simulation.

**Additionally ONE of the following property definitions apply:**  
* [simpleBatteryModel](#reference-simpleBatteryModel) 
* [lithiumIonBatteryModel](#reference-lithiumIonBatteryModel) 



---------------------------------------
<a name="reference-simplebatterymodel"></a>
## simpleBatteryModel

Simple battery model, pre-configured with attributes of an electric Smart.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|type|`string`|Type attribute for the type adapter.|No|None|None|
|chargingEfficiency|`number`|Dimensionless value giving the efficiency of the charging process.|No|[0.001, 1]|`0.8`|
|cells|`integer`|Amount of cells in the battery|No|[1, +$\infty$]|`100`|
|cellVoltage|`number`<br>`string`|Voltage of the cells. [V]|No|None|None|
|cellCapacity|`number`<br>`string`|Capacity of the cells. [Ah]|No|None|None|
|minStateOfCharge|`number`|Dimensionless value, specifying the minimal state of charge of the new battery. [0, 1]|No|[0, 1]|`1`|
|maxStateOfCharge|`number`|Dimensionless value, specifying the maximal state of charge of the new battery. [0, 1]|No|[0, 1]|`1`|



---------------------------------------
<a name="reference-lithiumionbatterymodel"></a>
## lithiumIonBatteryModel

Extended battery model.

**Properties**

|   |Type|Description|Required|Boundaries|Default|
|---|---|---|---|---|---|
|type|`string`|Type attribute for the type adapter.|No|None|None|
|chargingEfficiency|`number`|Dimensionless value giving the efficiency of the charging process.|No|[0.001, 1]|`0.8`|
|cells|`integer`|Amount of cells in the battery|No|[1, +$\infty$]|`100`|
|modules|`integer`|Amount of battery modules which contain all cells together.|No|[1, +$\infty$]|`1`|
|cellVoltage|`number`<br>`string`|Voltage of the cells. [V]|No|None|None|
|cellCapacity|`number`<br>`string`|Capacity of the cells. [Ah]|No|None|None|
|minStateOfCharge|`number`|Dimensionless value, specifying the minimal state of charge of the new battery. [0, 1]|No|[0, 1]|`1`|
|maxStateOfCharge|`number`|Dimensionless value, specifying the maximal state of charge of the new battery. [0, 1]|No|[0, 1]|`1`|
|peukertCoefficient|`number`|The Peukert Coefficient for battery drainage. Usually between 1 and 1.28 for li-ion batteries. Default: 1.08|No|[0, 3]|`1.08`|
|batteryResistance|`number`|The inner resistance of the battery in Ohm. Default: 0.00493 for li-ion batteries.|No|[0, 1]|`0.00493`|
|nominalVoltage|`number`<br>`string`|The nominal voltage of the battery.|No|None|None|
|minChargingThroughput|`number`| The minimal charging throughput that can be reached while charging in CV mode. (0,1]|No|[0.001, 1]|`0.15`|
|exponentialBase|`number`|Base for the exponential decline of energy added during CV charging.|No|[0, +$\infty$]|`3.5`|



---------------------------------------
<a name="reference-environmentmodel"></a>
## environmentModel

The model of the environment to be applied.

**Additionally ONE of the following property definitions apply:**  
* [defaultEnvironmentModel](#reference-defaultEnvironmentModel) 



---------------------------------------
<a name="reference-defaultenvironmentmodel"></a>
## defaultEnvironmentModel

Basic environment model, describing influences of the environment on battery simulation





