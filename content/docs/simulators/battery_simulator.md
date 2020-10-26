---
title: MOSAIC Battery Simulator
linktitle: Battery Simulator
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 110
menu:
  docs:
    parent: simulators
---

The MOSAIC Battery Simulator is used to simulate electric vehicles. It takes environment, vehicle
characteristics and the battery itself into account. The main feature of the battery ambassador is that it
can utilize dynamic class loading to use a batterymodel provided by the user, depending on the given
needs. This also holds true for the environment model and the vehicle model. However, simple models
for vehicle, environment and the battery are provided and will be briefly explained in the following
sections.

{{% alert extended %}}
The **Battery Simulator** is part of {{< link title="MOSAIC Extended" href="/download#overview" >}}.  
For further information on licenses, feel free to contact us via **[mosaic@fokus.fraunhofer.de](mailto:mosaic@fokus.fraunhofer.de)**.
{{% /alert %}}

### Installation

This simulator does not need to be installed. It is delivered as part of the MOSAIC Extended installation package.

### Configuration 

This ambassador can be configured with a configuration file. The specific path is
`<scenarioName>/battery/battery_config.json`


```FOLDER
└─ <scenario_name>
   └─ battery
      └─ battery_config.json ................. Battery ambassador configuration file
```


### Vehicle model

The vehicle model holds the general properties of a vehicle. Examples would be the weight of the vehicle
and the voltage at which the electric engine operates. However, as with the other models, the provided
class for the vehicle model direct affects what can be configured here. If other properties are needed for
the vehicle, this is the right place to put them. To implement an own vehicle, the class AVehicleModel
has to be extended.

### Battery model

The battery model defines the battery used by the vehicle itself. Useful properties could be the number
of cells and their capacity. As with the vehicle, this class can be freely defined and use configuration
values placed in the `batteryModelConfig-area`. To implement an own battery model, the class `ABatteryModel`
needs to be extended.

### Environment model

Normally environmental factors like rolling resistance of the given underground or air drag go into this
section. At the current state, just a minimal environment model is bundled with the battery ambassador,
mainly to show what is possible. To implement a custom environmentmodel, `AEnvironmentModel` has
to be extended.

### Sample configuration

```Json
{
    "vehicleModelClass": "com.dcaiti.vsimrti.fed.battery.sim.models.vehicle.ElectricSmart",
    "vehicleModelConfig": {
            "Mass": 1060,
            "ReferenceArea": 1.95,
            "DragCoefficient": 0.375,
            "TankToWheelEfficiency": 0.7,
            "EletricMotorOperatingVoltage": 350,
            "ConsumerOperatingVoltage": 12
    },
    "batteryModelClass": "com.dcaiti.vsimrti.fed.battery.sim.models.battery.VerySimpleBatteryModel",
    "batteryModelConfig": {
            "NumberOfCells": 93,
            "CellVoltage": 4.3,
            "CellCapacityInAh": 50,
            "eff_Summer": 0.8448,
            "RechargingType": 2,
            "MinSOC": 0.30,
            "MaxSOC": 0.70
        },
    "environmentModelClass": "com.dcaiti.vsimrti.fed.battery.sim.models.environment.DefaultEnvironment",
    "environmentModelConfig": {
            "Gravity": 9.81,
            "FluidDensity": 1.293,
            "RollingResistanceCoefficient": 0.01
        },
        "consumers": [ { "Radio": 10 }, { "HeadLight": 100 } ]
}
```
This listing shows how the vehicle, environment and battery model classes for the bundled models are configured. Additionally, an arbitrary number of consumers can be configured that draw additional power from the battery. In this case, headlights and a radio are pre-defined.