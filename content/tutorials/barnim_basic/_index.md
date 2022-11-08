---
title: Barnim Basic
categories:
 - Tutorial
linktitle: barnim_basic
toc: false
type: tutorials
date: "2019-05-05T00:00:00+01:00"
draft: false
pagination_prev: getting_started
pagination_next: barnim_advanced
---

{{% alert note %}}
All files you need for this tutorial are included in the Eclipse MOSAIC zip file:  
**[Download Eclipse MOSAIC](/download/)**
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
2. **Car A** now sends out a Decentralized Environmental Notification Message (DENM), which reaches other cars in its (relatively small) dissemination area. 
With multi hop routing, the DENM message is transported upstream towards other vehicles.
3. Cars that do not have any form of communication equipment are not warned and drive towards the
 icy part of the road. Since they have careful and responsible drivers they slow down to avoid accidents.
4. Cars that are equipped with the appropriate communication equipment are able to receive the DENM, which 
induces them to use a different route (green) which is safer and faster due to the lack of ice on it.
5. Last but not least, there is a **WeatherServer** that propagates weather information over the
cellular network. 
6. Im summary, while the simulation is running, you should see with the [Websocket Visualizer](/docs/visualization),
vehicles as moving markers indicating when they are sending **V2X** messages (green vehicles) and receiving **V2X** messages (red vehicles).

{{< figure src="images/barnim-map.png" title="Overview of Barnim tutorial scenario" numbered="true" >}}

## Overview of Applications 

In this section, the applications will be described briefly which are used in the Barnim tutorial. 

| Application | Description                                                                                                                                                                                                          |
| ----------- |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `org.eclipse.mosaic.app.tutorial.`**`SlowDownApp`** | Induces a speed reduction as soon as the onboard sensors detect hazardous conditions. After leaving the hazardous area, the vehicles will resume by increasing their speed again.                                    |
| `org.eclipse.mosaic.app.tutorial.`**`WeatherWarningApp`** | Vehicles with this application mapped simulate to be equipped equipped with ad hoc wifi. They might not be able to receive DENMs due to range limitations and drive into the icy section nonetheless.                |
| `org.eclipse.mosaic.app.tutorial.`**`WeatherWarningAppCell`** | A specialized form of the weather warning application above that can make use of cellular communication, simulates the Cellular communication enabled vehicles which are able to communicate with the WeatherServer. |
| `org.eclipse.mosaic.app.tutorial.`**`WeatherServerApp`** | Simulates a Weather-Server equipped with cellular communication. It is able to warn vehicles that can make use of cellular communication.                                                                       |

## Mapping configuration

This section gives a short explanation of the mapping we use in this scenario. 
First, we use five different types of entities. 
One server, namely the WeatherServer, and four types of cars, each of them loaded with different applications. 
As usual, the configuration takes place in `mapping/mapping_config.json` in your scenario folder.

In this tutorial, there is only one vehicle type named `Car` configured in the `prototypes` section. 
The `prototypes` attributes allows you to specify the properties and behaviour of all vehicles 
which inherit this vehicle type.

{{% alert tip %}}
Read the detailed documentation of the [Mapping Configuration](/docs/mosaic_configuration/mapping_ambassador_config).  
{{% /alert %}}

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
The `WeatherServer` is configured in 
the `servers` section of the `mapping_config.json` file. 
For the `CellAmbassador` to be able to recognize the `WeatherServer`, the `group`-field in the mapping below is 
`WeatherServer`. 
For a correct recognition, this field matches the `id`-field in the `cell/network.json`.
Check out [server configuration](https://www.eclipse.org/mosaic/docs/simulators/network_simulator_cell/#server-configuration) for more info.

```json
"servers": [
        {
            "name": "WeatherServer",
            "group": "WeatherServer",
            "applications": [ "org.eclipse.mosaic.app.tutorial.WeatherServerApp" ]
        }
]
```
In the `vehicles` section, we define the actual vehicles driving in the simulation. Each item represents 
a flow of vehicles on a certain route, which can be configured the following:
* `startingTime`: Start time of the first vehicle.
* `targetFlow` : Time distance between two departing vehicles, given in vehicles per hour (1800 veh/h = 2 sec time distance). 
* `maxNumberVehicles`: Maximum number of vehicles to be spawned in that particular flow.
* `route`: The initial route, the vehicles use when they are spawned.
* `types`: Mapping of the application and vehicle type. A weighting factor controls the mapping probability for each type.

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
        "output": true
    }
}
```

More information about the scenario configuration can be found [here](/docs/scenarios#main-configuration).

## How the running scenario should look like

{{< figure src="images/barnim-final.jpg" title="The running scenario" numbered="true" >}}
When the scenario is running, it should look as presented in the Figure above. Some vehicles are able to take a different route as they are receiving warning messages from other vehicles.

{{% alert tip %}}
If the scenario is running too fast and you can not observe vehicle markers in the visualization, you can slow down the simulation using the realtime brake `-b`&nbsp;/&nbsp;`--realtime-brake`. 
For example, using `-b 5` would slow down to 5 times realtime, that is 5 seconds in simulation would require 1 second in real time.
{{% /alert %}}

