---
title: Barnim Basic
linktitle:
toc: false
type: tutorials
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  tutorials:
    parent: barnim_basic
    weight: 1
---

{{% alert note %}}
All files you need for this tutorial are included in the Eclipse MOSAIC zip file:  
**{{< link title="Download Eclipse MOSAIC" href="/download" >}}**
{{% /alert %}}

The following tutorial shows some of the features of Eclipse MOSAIC and will take a closer look
at different federates. The map used in this tutorial is located near the city of Barnim, however,
all features and configurations are transferable on your own scenarios. 

{{% alert learning_objectives %}}
This tutorial includes configuration and mapping files to give you an understanding of the Eclipse MOSAIC scenarios.   
After completing this tutorial you will be able to:

* Describe and configure simulation entities for Eclipse MOSAIC scenarios.
* Enable and use a different communication simulator.
* Mapping applications onto simulation entities.
{{% /alert %}}

## Overview

In this scenario, several cars drive on the blue route and are forced to slow down in a specific section due
to icy conditions. The rest of the scenario can be described as follows:

1. A car (**Car A**) which is equipped with ad hoc communication (WiFi) capabilities detects an environmental 
hazard - in this case an icy section on the road.
2. **Car A** now sends out a DENM which reaches other cars in its (relatively small) dissemination area. 
With multi hop routing, the DENM message is transported upstream towards other vehicles.
3. Cars that do not have any form of communication equipment are not warned and drive towards the
 icy part of the road. Since they have careful and responsible drivers they slow down to avoid accidents.
4. Cars that are equipped with the appropriate communication equipment are able to receive the DENM, which 
induces them to use a different route (green) which is safer and faster due to the lack of ice on it.
5. Last but not least, the **WeatherServer** (technically implemented as an RSU) propagates information over the
cellular network and could therefore be located virtually everywhere.

{{< figure src="images/barnim-map.png" title="Overview of Barnim tutorial scenario" numbered="true" >}}

## Overview of Applications 

In this section, the applications will be described briefly which are used in the Barnim tutorial. 

| Application | Description  |
| ----------- | ------------ |
| `org.eclipse.mosaic.app.tutorial.`**`SlowDownApp`** | Induces a speed reduction as soon as the onboard sensors detect hazardous conditions. After leaving the hazardous area, the vehicles will resume by increasing their speed again. |
| `org.eclipse.mosaic.app.tutorial.`**`WeatherWarningApp`** | Vehicles with this application mapped simulate to be equipped equipped with ad hoc wifi. They might not be able to receive DENMs due to range limitations and drive into the icy section nonetheless. |
| `org.eclipse.mosaic.app.tutorial.`**`WeatherWarningAppCell`** | A specialized form of the weather warning application above that can make use of cellular communication, simulates the Cellular communication enabled vehicles which are able to communicate with the WeatherServer. |
| `org.eclipse.mosaic.app.tutorial.`**`WeatherServerApp`** | Simulates a fixed Weather-Server equipped with cellular communication. Despite the greater distance it is able to warn vehicles that can also make use of cellular communication. |

## Mapping configuration

This section gives a short explanation of the mapping we use in this scenario. 
First, we use five different types of entities. 
One RSU which acts as the WeatherServer and four types of cars, each of them loaded with different applications. 
As usual, the configuration takes place in `mapping/mapping_config.json` in your scenario folder.

In this tutorial, there is only one vehicle type named `Car` configured in the `prototypes` section. 
The `prototypes` attributes allows you to specify the properties and behaviour of all vehicles 
which inherit this vehicle type.

```json
"prototypes": [
    {
        "name": "Car",
        "vehicleClass": "ElectricVehicle",
        "accel": 2.6,
        "decel": 4.5,
        "emergencyDecel": 6.0,
        "length": 5.00,
        "maxSpeed": 70.0,
        "minGap": 2.5,
        "sigma": 0.5,
        "tau": 1,
        "speedFactor": 1.0,
        "speedMode": "DEFAULT",
        "laneChangeMode": "DEFAULT",
        "deviations": {
            "speedFactor": 0.0,
            "length": 0.0,
            "minGap": 0.0,
            "maxSpeed": 0.0,
            "accel": 0.0,
            "decel": 0.0,
            "tau": 0.0
        }
    }
]
```
As mentioned above, the RSU entity acts as a `WeatherServer` and it is configured in 
the `rsus` section of the `mapping_config.json` file. 
As shown below, the RSU has fixed coordinates and the application 
`com.dcaiti.vsimrti.app.tutorials.barnim.WeatherServer` is mapped which gives `WeatherServer` functionality to the RSU.

```json
"rsus": [
        {
            "lat": 52.65027,
            "lon": 13.54500,
            "name": "WeatherServer",
            "applications": [ "org.eclipse.mosaic.app.tutorial.WeatherServerApp" ]
        }
    ]
```
In the `vehicles` section, we define the actual vehicles driving in the simulation. Each item represents 
a flow of vehicles on a certain route, which can be configured the following:
* `startingTime`: start time of the vehicle first vehicle.
* `targetFlow` : Density of vehicles per hour. 
* `maxNumberVehicles`: Number of vehicles in the simulation.
* `route`: Select the route for the vehicles
* `types`: Mapping the application, vehicle type, communication type, weighting factor.

The `types` attribute defines the vehicle type and the applications mapped to the vehicle. By having
the `weight` attribute, we define a distribution of vehicle types. In this case, 10% of the vehicles
using cellular based application, 20% using ITS-G5 based application, and 70% of the vehicles
have no additional functionality to receive messages from the weather server.

```json
"vehicles": [
        {
            "startingTime": 5.0,
            "targetFlow": 1800,
            "maxNumberVehicles": 120,
            "route": "1",
            "lanes": [ 0, 1 ],
            "types": [
                {
                    "applications": [
                        "org.eclipse.mosaic.app.tutorial.WeatherWarningAppCell",
                        "org.eclipse.mosaic.app.tutorial.SlowDownApp"
                    ],
                    "name": "Car",
                    "group": "Cellular",
                    "weight": 0.1
                },
                {
                    "applications": [
                        "org.eclipse.mosaic.app.tutorial.WeatherWarningApp",
                        "org.eclipse.mosaic.app.tutorial.SlowDownApp"
                    ],
                    "name": "Car",
                    "group": "AdHoc",
                    "weight": 0.2
                },
                {
                    "applications": [
                        "org.eclipse.mosaic.app.tutorial.SlowDownApp"
                    ],
                    "name": "Car",
                    "group": "Unequipped",
                    "weight": 0.7
                }
            ]
        }
    ]
```

## Scenario configuration

The main Eclipse MOSAIC scenario configuration file that resides in `scenario_config.json`, defines the general 
simulation parameter as (`duration`, `id` etc.). Since several applications are mapped, we need to make sure that 
the corresponding simulators are enabled. The last part of the `scenario_config.json` configuration file 
is used to enable and disable certain simulators according to the needs of the user.

Per default, the simulation of cellular communication is disabled. In order to enable communication via 
cellular networks in this scenario, you need to enable the `cell` simulator by setting the field `active` to `true`:

```json
"federates": {
    "cell": true,
    ...
}
```

The `scenario_config.json` configuration file of the Barnim tutorial should have following activated simulators:

```json
{
    ...,
    "federates": {
        "cell": true,
        "omnetpp": false,
        "ns-3": false,
        "sns": true,
        "sumo": true,
        "application": true,
        "environment": true,
        "battery": false,
        "charging": false,
        "visualizer": true
    }
}
```
More information about the scenario configuration can be found
{{< link title="here" href="/docs/building_scenarios/#main-configuration" >}}.
