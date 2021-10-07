---
title: MOSAIC Battery Simulator 
linktitle: E-Mobility - Battery 
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 110
menu:
  docs:
    parent: simulators
---

For simulation of electric vehicles, the **Battery Simulator** handles the actual processes of
- Discharging
- Charging (in connection with a [charging station](emobility_simulator_charging))
- Recuperation

## Installation

{{% alert extended %}} The **Charging Station and Battery Simulators** are part of [MOSAIC Extended](/download#overview).  
For further information on licenses, feel free to contact us via **[mosaic@fokus.fraunhofer.de](mailto:mosaic@fokus.fraunhofer.de)**.
{{% /alert %}}

## Overview

In order for a vehicle to move the drive train has to overcome the forces of resistance on the vehicle. Additionally, the energy of
consumers that run of the electric motor has to be generated. These forces plus the consumed energy minus the recuperation energy
build a balance that will be calculated by the battery simulator. Below is an illustration of all the forces at hand.

{{< figure src="../images/electric_vehicle_forces.png" title="Simplified model on applied forces on vehicles" >}}

To provide for different electric vehicle types the Battery Simulator takes environment, vehicle characteristics and battery attributes into
account. One of the main features of the battery ambassador is that it can utilize dynamic class loading to use custom models, tailored to
the user's needs. The Battery Simulator comes bundled with some basic but powerful models for 
[vehicles](emobility_simulator_battery/#vehicle-model), [environment](emobility_simulator_battery/#environment-model) and the 
[battery](emobility_simulator_battery/#battery-model). These will be explained in the following paragraphs.

{{< figure src="../images/BatterySimulator_ClassDiagram.svg" title="Simple overview of class relations for the Battery Simulator" >}}

## Configuration

```plaintext
└─ <scenario_name>
   └─ battery
      └─ battery_config.json ................. Battery ambassador configuration file
```

The prior discussed configuration for different models for vehicles, batteries and the environment happens in the `battery_config.json`. For
the vehicle and battery model it is possible to define separate models per vehicle prototype and default models. Whenever an electric
vehicle is added and no models for the prototype were defined the Battery Simulator defaults to those default models. Currently, the
environment model is statically defined for all vehicles and the entire scenario.

### Vehicle model

The vehicle model holds the general properties of a vehicle influencing the battery consumption. Examples would be the weight of the vehicle, and the voltage at which the
electric engine operates. As with the other models, the provided class for the vehicle model directly affects what can be
configured here. If other properties are needed for the vehicle, this is the right place to put them. It is possible to define
separate consumers like the AC or radio, which will also have an effect on the discharging of the battery. Additionally, the recuperation support of a vehicle could be configured.

To implement an own vehicle, the class `AbstractVehicleModel` has to be extended.

**Bundled Model**

The bundled vehicle model just allows to statically set all parameters necessary for the calculation of employed forces. It comes
pre-configured with attributes oriented on an Electric Smart. In a real-world scenario however many of these attributes are dynamic, the
weight for example changes with the amount of passengers and carried cargo.

### Battery model

The battery model defines the battery used by the vehicle and especially handles (dis)charging characteristics. Important properties would be the number of cells and their capacity. 

To implement an own battery model, the class `AbstractBatteryModel`
needs to be extended.

**Bundled Models**

The Battery Simulator comes bundled with two battery models, namely the `SimpleBatteryModel` and the `LithiumIonBatteryModel`. While the
simple model just linearly charges, discharges and recuperates energy, the lithium battery model employs a more sophisticated emulation of
the behaviors observed in real-world lithium-ion batteries. This for example includes reduced charging speeds at higher battery capacities.

### Environment model

Environmental factors like rolling resistance of the given underground or air drag go into this section. At the current state, a basic environment model is bundled with the Battery Simulator. To implement a custom environment
model, `AbstractEnvironmentModel` has to be extended.

**Bundled Model**

The bundled model includes basic environmental constants, which can deviate slightly with different altitudes, weather conditions and the
likes. However, for most applications static definitions should be sufficient.

### Example configuration

```json
{
    "defaultVehicleModel": {
        "type": "SimpleVehicleModel",
        "vehicleMass": "1060 kg",
        "referenceArea": 1.95,
        "dragCoefficient": 0.375,
        "tankToWheelEfficiency": 0.7,
        "electricMotorOperatingVoltage": "350 V",
        "consumerOperatingVoltage": "12 V",
        "recuperationEfficiency": 1.0,
        "maxRecuperationPower": 60e3,
        "electricConsumers": [
            { "Radio": 10 },
            { "HeadLight": 100 }
        ]
    },
    "defaultBatteryModel": {
        "type": "SimpleBatteryModel",
        "cells": 100,
        "cellVoltage": "5 V",
        "cellCapacity": "100 Ah",
        "chargingEfficiency": 0.8,
        "minStateOfCharge": 1,
        "maxStateOfCharge": 1
    },
    "vehicleModelMap": {
        "prototype_1": {
            "type": "SimpleVehicleModel",
            "vehicleMass": "1060 kg",
            "referenceArea": 1.95,
            "dragCoefficient": 0.375,
            "tankToWheelEfficiency": 0.7,
            "electricMotorOperatingVoltage": "350 V",
            "consumerOperatingVoltage": "12 V",
            "recuperationEfficiency": 1.0,
            "maxRecuperationPower": 60e3,
            "electricConsumers": [
                { "Radio": 10 },
                { "HeadLight": 100 }
            ]
        }
    },
    "batteryModelMap": {
        "prototype_1": {
            "type": "SimpleBatteryModel",
            "cells": 100,
            "cellVoltage": "5 V",
            "cellCapacity": "100 Ah",
            "chargingEfficiency": 0.8,
            "minStateOfCharge": 1,
            "maxStateOfCharge": 1
        }
    },
    "environmentModel": {
        "type": "DefaultEnvironmentModel",
        "fluidDensity": 1.293,
        "rollingResistanceCoefficient": 0.01,
        "gravitationalAcceleration": 9.81
    }
}
```

This listing shows how the vehicle, environment and battery model classes for the bundled models are configured.