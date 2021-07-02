---
title: Simulation Entities and Application Mapping 
linktitle: Application - Mapping
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 17
menu:
  docs:
    parent: simulators
---

Closely related to the Application Simulator, the **Mapping** Ambassador is used for the initial choreography of a simulation.
It defines two major aspects for the simulation units:
1. number, properties, position (e.g. of RSUs, traffic lights) or initial routes (of vehicles, simulated in a traffic/vehicle simulator)
2. specific application(s) to be "mapped" on the simulation units and simulated in the Application Simulation

The JSON based configuration is located in `<scenario_name>/mapping/mapping_config.json`.


### Configuration

The Mapping configuration is divided into different parts:
* Pre Definitions of `prototypes` and `deviations`
* Entity Definitions of `vehicles`, `rsus`, `tls` `servers` and `tmcs`
* Advanced Vehicle Definitions (including route generation) in `matrixMappers`
* Common Definitions in `config`

#### Prototypes

`prototypes` define models for other objects, which can be reused later in the other sections of the Mapping. This allows reusing the
definition of certain entities such as vehicles or the combination of multiple applications, reducing redundancies and resulting in
shorter Mapping configurations.

```json
"prototypes": [
    {
        "name": "CamVehicle",
        "accel": 2.6,
        "decel": 4.5,
        "length": 5.00,
        "maxSpeed": 70.0,
        "applications": [ "org.eclipse.mosaic.fed.application.app.etsi.VehicleCamSendingApp" ]
    }
]
```

Prototypes can be created for all types of entities. Next to the list of `applications` which is available for all types of entities,
vehicle types provide various other parameters to be adjusted. 

| Parameter | Description | Deviation |
|-----------|-------------| ----------|
| `vehicleClass`     | The class of the vehicle, e.g. `Car`, `ElectricVehicle`, `EmergencyVehicle`, `Bicycle`, `HeavyGoodsVehicle`, and more. |  |
| `accel`            | The maximum acceleration of the vehicle in $m/s^2$. | Yes |
| `decel`            | The maximum deceleration of the vehicle in $m/s^2$, e.g. when stopping for traffic lights. | Yes |
| `emergencyDecel`   | The maximum deceleration of the vehicle in $m/s^2$, in order to avoid accidents. | |
| `length`           | The length of the vehicle in $m$. | Yes |
| `maxSpeed`         | The maximum speed of the vehicle in $m/s$. | Yes | 
| `minGap`           | The minimum gap towards the leader in $m$, i.e. the space in front in a traffic jam. | Yes | 
| `sigma`            | The driver's imperfection $[0,1]$. | |
| `tau`              | The reaction time (or time headway) of the vehicle in $s$. | Yes |
| `speedFactor`      | This factor is used to determine the speed limit to comply on roads, e.g. `1.1` would exceed the speed limit by 10%. | Yes |
| `laneChangeMode`   | The lane changing behavior of the vehicle: `COOPERATIVE`. `CAUTIOUS`, `AGGRESSIVE`, `PASSIVE`, `OFF`  |  |
| `applications`     | The list of applications to map onto this vehicle type.  |  |

For the majority of the parameters above (see column "Deviation"), a normal distribution can be created. In that case, each individual
vehicle spawned with this prototype will be loaded with a random value within this distribution. To achieve this, a separate `deviations`
attribute must be added to the type:

```json
"prototypes": [
        {
            "name": "Car",
            "length": 5.0, 
            "maxSpeed": 70.0,
            "deviations": {
                "length": 1.2,
                "maxSpeed": 5.0
            }
        }
    ]
```

According to the config above, the basic parameter value conforms to the expected value, and the given value in the `deviations`
attribute conforms to the $\sigma$ of the Gaussian distribution(meaning for the example of maxSpeed that ~68% of the values will 
be located in the interval [65.0, 75.0]). The deviation will be limited to &plusmn;2$\sigma$.

#### Entities

**Vehicles**

The `vehicles`-section is the centerpiece of the Mapping configuration. It defines the departures (times and number),
routes, and types of the vehicles.

Each spawner in this list generates a traffic stream of vehicles on a certain `route`. The vehicles stream begins at `startingTime` and 
generates vehicles until `maxNumberVehicles` is reached. The time between two consecutively vehicles is implicitly given by the
`targetFlow` property, which defines how many vehicles per hour are going to be spawned. 

Each vehicle spawner must refer to at least one vehicle type (`types`). A vehicle type must either refer to a type from the `prototypes`
section by using its `name`, or be defined as a completely new vehicle type with all necessary parameters. If more than one vehicle type
is referenced in the `types` attribute, `weight`s can be used to specify the ratios to choose between them when loading an individual
vehicle. If no weights are defined, individual vehicle types are assumed to be distributed equally. 
>Note: if at least one vehicle type has a weight defined, all types without a defined weight are ignored.

```json
"vehicles": [
    {
        "startingTime": 5.0,
        "targetFlow": 1800,
        "maxNumberVehicles": 120,
        "route": "1",
        "types": [
            {
                "name": "CAMVehicle",
                "weight": 0.1
            },
            {
                "name": "NormalVehicle", // this vehicle has no applications 
                "applications": [ ],  
                "weight": 0.2
            }
        ]
    }
]
```

Additional notes:
 * The `route` refers to a route usually defined in the scenario database file (`*.db`) of the scenario.
 * In order to define only one single vehicle to be spawned, the `maxNumberVehicles` property can be set to `1`.
 * By defining the `endingTime` property, the flow is stopped from being generated when the given simulation time is reached.
 * By defining the `spawningMode` to one of the following values, the departure time of the individual vehicles can be adjusted:
    * `CONSTANT` - default case, all vehicles have equal time distance to match `target_flow`.
    * `POISSON` -  vehicles depart within a Poisson distribution, resulting in a more natural traffic flow.
    * `GROW` - the flow of departing vehicles increases linear up to `target_flow`.
    * `SHRINK` - the flow of departing vehicles decreases linear starting at `target_flow`.
    * `GROW_AND_SHRINK` - the flow of departing vehicles increases up to `target_flow` and decreases afterwards.
 * By defining the `laneSelectionMode` to one the following values, the selection of the departure lane can be adjusted:
    * `DEFAULT` - selects the lane for the next vehicle based on the list of given `lanes` in a roundrobin manner.
    * `ROUNDROBIN_HIGHWAY` - trucks will be spawned on the rightmost lane, all other vehicles according to `DEFAULT`.
    * `HIGHWAY` - trucks will be spawned on the rightmost lane, all other vehicles according to `BEST`.
    * `RANDOM` - the vehicle will be placed randomly on one of the available lanes of the road.
    * `FREE` - the vehicle will be placed on a free lane of the road.
    * `BEST` - the vehicle will be placed on the best lane of the road, according to the current traffic situation and departure speed.

**Road Side Units**

The `rsus`-section offers the possibility to define instances of application supported Road Side Units (RSU)s and place them on a
defined position (`lat`, `lon` coordinates). Referring to `prototype` definitions with simply specifying its name in the `name`
property will automatically fill in relevant properties of the RSU.

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

**Traffic Lights**

In the `trafficLights`-section, applications can be mapped to traffic light groups. Usually, individual traffic lights are part of
traffic light groups to control a whole junction, whereas the junction possesses a certain position. The traffic light groups and
their positions are defined in the simulator specific configuration file (e.g. the *.net.xml for SUMO and *.ttl.json for PHABMACS).
The `tlGroupId`-property allows mapping of applications to the traffic light groups, referring them by Id.

Alternatively, the definition of the `weight`-property leads to a random distribution of the referred applications through ALL traffic lights of the
scenario (Note: The weights do not have to add up to 100 or 1). Consequently, all traffic lights will be mapped using the specified
prototypes as soon as one weight differs from zero. So in case you don’t want all traffic lights to have applications running on them you
have to define one traffic light without any applications and add a weight to it. If neither tlGroupId nor weight are defined for an app, the weight will be set to 1.

```json
"trafficLights": [
    {
        "tlGroupId": "26704448",
        "applications": [ "org.eclipse.mosaic.app.tutorial.TrafficLightApp" ]
    },
    {
        "tlGroupId": "252864802",
        "applications": [ "org.eclipse.mosaic.app.tutorial.TrafficLightApp" ]
    }
]
```

For more information, explained for detailed examples with different mapping options regarding traffic lights, please refer to
[Simulation Scenarios - Traffic Lights](/docs/building_scenarios#traffic-lights).

**Servers**

The `servers`-array can be used to specify server units, which can be used to communicate with other units via the cell module.
Capacity configurations for servers should be done when enabling the `CellModule`. Delay and transmission models are configured
in the `network.json` of the cell module (see [here](/docs/simulators/network_simulator_cell)).
> Note: The `group` parameter in the mapping configuration has to match with the id in the network configuration in order to
> properly function.
```json
"servers": [
    {
        "name": "MyServer",
        "group": "TestServers",
        "applications": [ "ServerApp1", "ServerApp2" ]
    }
]
```
**Traffic Management Centers**

The `tmc`-section offers the possibility to define instances of a Traffic Management Center (TMC). A TMC
provides the possibility to interact with the infrastructure of the road, i.e. retrieving traffic properties
from detectors (e.g. traffic flow), and changing properties from the road (e.g. speed limits).
Additionally, TMCs are an extension of Servers and can be configured in the same way that servers are

```json
"tmcs": [
    {
        "name": "HighwayManagement",
        "group": "TestTmcServers",
        "applications": [ "org.eclipse.mosaic.app.tutorial.HighwayManagementApp('3', 3)" ],
        "inductionLoops": [ "detector_0", "detector_1", "detector_2" ],
        "laneAreaDetectors": [ ]
    }
]
```

> All unit spawners could be realized in two different ways. The Deterministic Mapping produces the exact same sequence of mapped vehicles
> in every simulation run with regard to the given ratios at each point in time the simulation).
> The Stochastic Mapping results in a random order of mapped units.

#### Use Type Distributions in Complex Traffic Scenarios

In the case, you have many vehicle spawners defined and you want to distribute prototypes on those vehicles equally without defining them
again and again, you can use `typeDistributions`. By doing so, it is very simple to adjust the list of types and weights at only one
place in the configuration file.

Instead of defining an equal list of types and weights for each single vehicle spawner, like in this example:

```json
"vehicles": [
    {
        "startingTime": 5.0,
        "targetFlow": 1800,
        "maxNumberVehicles": 120,
        "route": "1",
        "types": [
            { "name": "TypeA", "weight": 0.1 },
            { "name": "TypeB", "weight": 0.9 }        
        ]
    },
    {
        "startingTime": 55.0,
        "targetFlow": 1800,
        "maxNumberVehicles": 120,
        "route": "2",
        "types": [
            { "name": "TypeA", "weight": 0.1 },
            { "name": "TypeB", "weight": 0.9 }        
        ]
    }
]
```

... you can use `typeDistributions` to define the distribution of types for each vehicle once and reuse them:

```json
"typeDistributions": {
    "exampleTypeDist" : [
        { "name": "TypeA", "weight": 0.1 },
        { "name": "TypeB", "weight": 0.9 }       
    ]
},
"vehicles": [
    {
        "startingTime": 5.0,
        "targetFlow": 1800,
        "maxNumberVehicles": 120,
        "route": "1",
        "typeDistribution": "exampleTypeDist"
    },
    {
        "startingTime": 55.0,
        "targetFlow": 1800,
        "maxNumberVehicles": 120,
        "route": "2",
        "typeDistribution": "exampleTypeDist"
    }
]
```


#### Advanced vehicle spawners with route generation

It is also possible to define and use OD (origin-destination) matrices by adding a ODMatrixMapper to the `matrixMappers`-list.
Each MatrixMapper consists of a list of `points`, the vehicle-`types` to be used and the actual flow-values (`odValues`) between each
of the points. It is possible to define multiple matrices using different values for `startingTime` and `maxTime`.
This way can achieve distinctively different compositions of the vehicle flows.

The MatrixMapper will be called before the actual execution of the simulation and will generate vehicle-spawners for the flow between
each of the points.

```json

"matrixMappers": [
    {
        "points": [ 
            {
                "name": "CityA", 
                "position": {
                    "center": {
                        "latitude": 52,
                        "longitude": 13
                    },
                    "radius": 1000
                }       
            },
            {
                "name": "CityB", 
                "position": {
                    "center": {
                        "latitude": 48,
                        "longitude": 10
                    },
                    "radius": 1000
                }       
            }
        ],
        "types": [
            {
                "name": "CAMVehicle"
            }
        ],
        "odValues": [
            [0, 100], //100 vehicles from CityA to CityB
            [200, 0]  //200 vehicles from CityB to CityA
        ]
    }
]
```

#### Common Configuration

Next to the specific configuration of prototypes and simulation entities, some general parameters can be adjusted:

```json
{
    "config": {
        "scaleTraffic" : 1.0, 
        "start": 0, 
        "end": 500,
        "adjustStartingTimes": false,
        "randomizeFlows": false,
        "randomizeStartingTimes" : false,
        "randomizeWeights": false
    }
}
``` 

| Parameter | Description |
|-----------|-------------|
| `scaleTraffic`        | Scales the `targetFlow` of spawned vehicles per hour as well as the `maxNumberVehicles` by the given factor.  |
| `start`               | Adjusts the point in time (in $s$) to start spawning vehicles. Any vehicle spawner with a lower `startingTime` will be ignored. |
| `end`                 | Adjusts the point in time (in $s$) to end spawning vehicles. Any vehicle spawner with a greater `startingTime` will be ignored. |
| `adjustStartingTimes` | If set to `true`, the starting time of each spawner is reduced by the value in `start`. | |
| `randomizeFlows`      | If set to `true`, the departure time of vehicles within a vehicle spawner is slightly randomized. |
| `randomizeStartingTimes`   | If set to `true`, the starting time of each vehicle spawner is slightly randomized. |
| `randomizeWeights`   | If set to `true`, each `weight` greater than zero is slightly randomized. |

{{% alert tip %}}
Read the detailed documentation of the [Mapping Configuration](/docs/mosaic_configuration/mapping_ambassador_config).  
{{% /alert %}}

### Unit Identifiers

Every traffic object in Eclipse MOSAIC has a globally unique string identifier. These identifiers are used to identify 
a traffic object in Eclipse MOSAIC as well as in different ambassadors. From user’s aspect, these identifiers will be seen in the log files
which are generated after a simulation. The following table explains, which identifier belongs to which traffic object.

| **Traffic Object** | **Eclipse MOSAIC Internal ID** |
| ------------------ | ----------------------- |
| **Vehicle**        | `veh_<seq_nr>`           |
| **RSU**            | `rsu_<seq_nr>`           |
| **TMC**            | `tmc_<seq_nr>`           |
| **Traffic Light**  | `tl_<group_id>`         |

* `seq_nr` is the sequence number of simulated vehicles, RSUs, TMCs, each starting from zero.
* `group_id` is the group id of the traffic light.

