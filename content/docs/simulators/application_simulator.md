---
title: Application Simulator
linktitle: Application Simulator
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  docs:
    parent: simulators
    weight: 8
---

This section presents the architecture and the main features of the **Application Simulator** as well as the related **Mapping** Ambassador, which is used to configure individual simulation entities (or simulation units) and "map" applications to them.

## Eclipse MOSAIC Application Simulator

The **Application Simulator** plays an important role in the simulation of vehicles and its functions. It provides the capability 
to model the application logic for different simulation units (e.g. vehicles, road side units (RSUs), traffic lights, and others) 
as well as possible interaction attempts between the units via different communication links.

### Folder Structure

```FOLDER
└─ <scenario_name>
   ├─ application
   |  ├─ YourApplication.jar
   |  ├─ application_config.json ............. Configuration file for the ambassador.
   |  └─ <scenario_name>.db .................. Database file for navigation.
   └─ mapping
      └─ mapping_config.json ................. Configuration file for the ambassador.
```

This ambassador can be configured with a configuration file. The specific path is
`<scenario_name>/application/application_config.json`. However, it is not necessary to provide such file.

### Installation

This simulator does not need to be installed. It is delivered as part of the Eclipse MOSAIC installation package.

### Overview
Each simulation unit (e.g. vehicle, RSU, traffic light ..) can have different applications (depending on their application [Mapping]({{< ref "docs/simulators/application_simulator.md#eclipse-mosaic-mapping" >}})). The applications for the units are basically compiled JAVA classes, which **extend** the abstract class
 `AbstractApplication`. Those classes have to be deployed as pre-compiled JAR files into the `application` folder of the simulated scenario.

{{< figure src="../images/application_overview.svg" title="Overview of interaction between applications and the unit's operating system with its modules. An example V2X message propagation is presented." >}}

#### Application Operating System
The `AbstractApplication` possesses a unit-specific `OperatingSystem`, which allows interactions with the simulated parameters. The operating system provides access to information like the current time or position of the units and could control unit-specific actions (like `slowDown()` for vehicles).

As the interaction types for navigation (retrieving road network information and calculating routes) and communication (preparing and sending messages) are more complex, they are separated into the specific modules `NavigationModule` (Navigation + Routing for vehicles) / `RoutingModule` (Routing-only for static units) and `AdHocModule` / `CellModule` with APIs dedicated to their purpose.

The following table lists all modules a unit's operating system could provide.

| Module           | Description                                                                              |
| ---------------- | -----------------------------------------------------------------------------------------|
| NavigationModule | Full featured access to the central navigation component for vehicles                    |
| RoutingModule    | Access to routing functionalities for static units as RSUs                               |
| AdHocModule      | Communication via ad hoc mode, using WIFI or ITS G5 specific means (e.g. for addressing) |
| CellModule       | Communication via cellular services (different configuration / addressing modes)         |

**Note:** The presented communication modules `AdHocModule`, `CellModule` are used for the sending part of a transmission. The message reception is realized by Application Interfaces provided by the `CommunicationApplication`.

#### Application Interfaces
Application interfaces handle call-backs to incoming events via their methods, like `onVehicleUpdated()`, called by the application simulator. 
The following table lists all interfaces usable for application implementation, the type of unit as well as important other interfaces it implements. Interface specific public methods which have to be implemented by the user are listed in the "Provides" column. The elementary interface (`Application`) provides the methods `onStartup()`, `onShutdown()`. Implementation details are given in [Development of applications]({{< ref "/docs/develop_applications" >}}).

| Interface                            | Applicable to    | Provides                                              | Description            |
| -------------------------------------| ---------------- | ----------------------------------------------------- | ---------------------- |
| `Application / AbstractApplication`  | *all*            | `onStartup`, `onShutdown`                             | Elementary application class providing an operating system          |
| `ConfigurableApplication`            | *all*            |                                                       | Basic application class providing an operating system and a configuration, which automatically loaded from a JSON file. |
| `CommunicationApplication`           | *all*            | `onMessageReceived`, `onAcknowledgementReceived`, `onCamBuilding`, `onMessageTransmitted` | All applications that implement some form of V2X communication are to implement this interface. |
| `VehicleApplication`                 | vehicle          | `onVehicleUpdated`                                    | General vehicle funtionality |
| `ElectricVehicleApplication`         | vehicle          | `onBatteryStateUpdated`, `onChargingRequestRejected`  | Electric vehicle functionality |
| `TrafficSignAwareApplication`        | vehicle          | `onTrafficSignInvalidated`, `onTrafficSignNoticed`    | Used by vehicles which are aware of traffic signs. |
| `TrafficLightApplication`            | traffic light    | `onTrafficLightGroupUpdated`                          | Traffic light functionality |
| `TrafficManagementCenterApplication` | TMC              | `onInductionLoopUpdated`, `onLaneAreaDetectorUpdated` | Traffic management functionality |
| `MosaicApplication`                  | *all*            | `onSumoTraciResponded`, `onInteractionReceived`       | Features that involve customized RTI-interactions of MOSAIC |

**Note:** A roadside unit (RSU) is the most unit and usually communicates only. Thus, an RSU application implements `CommunicationApplication`.

---

### Configuration

The Application simulator is configured in the file `<scenario_name>/application/application_config.json`:

```json
{
    "messageCacheTime": "30s",
    "minimalPayloadLength": 200,
    "encodePayloads": true,
    "navigationConfiguration" : {
        "type": "database"
    }
}
```

{{% todo %}}Link to JavaDoc section.{{% /todo %}}

Furthermore, depending on the deployed applications, the applications itself may offer configuration options 
in custom configuration files (e.g. `ETSIApplication.json` or `ETSIApplication_veh_0.json`).

---

## Eclipse MOSAIC Mapping

Closely related to the Application Simulator, the **Mapping** Ambassador is used for the initial choreography of a simulation. It defines two major aspects for the simulation units:
1. number, properties, position (e.g. of RSUs, traffic lights) or initial routes (of vehicles, simulated in a traffic/vehicle simulator)
2. specific application(s) to be "mapped" on the simulation units and simulated in the Application Simulation

The JSON based configuration is located in `<scenario_name>/mapping/mapping_config.json`.


### Configuration

The Mapping configuration is divided into different parts:
* Pre Definitions of `prototypes` and `deviations`
* Entity Definitions of `vehicles`, `rsus`, `tls` and `tmcs`
* Advanced Vehicle Definitions (including route generation) in `matrixMappers`
* Common Definitions in `config`

#### Prototypes

`prototypes` define models for other objects, which can be reused later in the other sections of the Mapping. This allows reusing the definition of certain entities such as vehicles or the combination of multiple applications, reducing redundancies and resulting in shorter Mapping configurations.

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

Prototypes can be created for all types of entities. Next to the list of `applications` which is available for all types of entities, vehicle types 
provide various other parameters to be adjusted. 

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

For the majority of the parameters above (see column "Deviation"), a normal distribution can be created. In that case, each individual vehicle spawned with this prototype 
will be loaded with a random value within this distribution. To achieve this, a separate `deviations` attribute must be added to the type:

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

According to the config above, the basic Parameter value conforms to the expected value and the given value in the `deviations` attribute conforms to the $\sigma$ of the Gaussian distribution(meaning for the example of maxSpeed that ~68% of the values will be located in the interval [65.0, 75.0]). The deviation will be limited to &plusmn;2$\sigma$.

#### Entities

**Vehicles**

The `vehicles`-section is the centerpiece of the Mapping configuration. It defines the departures (times and number), routes, and types of the vehicles.

Each spawner in this list generates a traffic stream of vehicles on a certain `route`. The vehicles stream begins at `startingTime` and 
generates vehicles until `maxNumberVehicles` is reached. The time between two consecutively vehicles is implicitly given by the `targetFlow` property, which
defines how many vehicles per hour are going to spawned. 

Each vehicle spawner must refer to at least one vehicle type (`types`). A vehicle type must either refer to a type from the `prototypes` section by using its `name`, 
or be defined as a completely new vehicle type with all necessary parameters. If more than one vehicle type is referenced in the `types` attribute, 
`weight`s can be used to specify the ratios to choose between them when loading an individual vehicle. If no weights are defined, invididual vehicle types are assumed to be distributed equally. 
Note: if at least one vehicle type has a weight defined, all types without a defined weight are ignored.

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

The `rsus`-section offers the possibility to define instances of application supported Road Side Units (RSU)s and place them on a defined position (`lat`, `lon` coordinates). Referring to `prototype` definitions with simply specifying its name in the `name` property will automatically fill in relevant properties of the RSU.

```json
"rsus": [
    {
        "lat": 52.65027,
        "lon": 13.54500,
        "name": "WeatherServer",
        "applications": [ "com.dcaiti.vsimrti.app.tutorials.barnim.WeatherServer" ]
    }
]
```

**Traffic Lights**

In the `trafficLights`-section, applications can be mapped to traffic light groups. Usually, individual traffic lights are part of traffic light groups to control a whole junction, whereas the junction possesses a certain position. The traffic light groups and their positions are defined in the simulator specific configuration file (e.g. the *.net.xml for SUMO and *.ttl.json for PHABMACS). The `tlGroupId`-property allows mapping of applications to the traffic light groups, referring them by Id.

{{% todo %}}Der folgende Absatz soll nach der Lösung des 4. Issue in Eclipse Mosaic Repository (Mapping -> Add Apps to all TrafficLights) geändert werden {{% /todo %}} 
Alternatively, the definition of weights leads to a random distribution of the referred applications through ALL traffic lights of the scenario. (Note: The weights do not have to add up to 100 or 1. Consequently all traffic lights will be mapped using the specified prototypes as soon as one weight differs from zero. So in case you don’t want all traffic lights to have applications running on them you have to define one traffic light without any applications and add a weight to it.

```json
"trafficLights": [
    {
        "tlGroupId": "26704448",
        "applications": [ "com.dcaiti.vsimrti.app.tutorials.tiergarten.trafficLight.TrafficLightApp" ]
    },
    {
        "tlGroupId": "252864802",
        "applications": [ "com.dcaiti.vsimrti.app.tutorials.tiergarten.trafficLight.TrafficLightApp" ]
    }
]
```

For more information, explained for detailed examples with different mapping options regarding traffic lights, please refer to [Simulation Scenarios - Traffic Lights](</docs/building_scenarios/scenarios/#traffic-lights>).

**Traffic Management Centers**

The `tmc`-section offers the possibility to define instances of a Traffic Management Center (TMC). A TMC
provides the possibility to interact with the infrastructure of the road, i.e. retrieving traffic properties
from detectors (e.g. traffic flow), and changing properties from the road (e.g. speed limits).

```json
"tmcs": [
    {
        "name": "HighwayManagement",
        "applications": [ "com.dcaiti.vsimrti.app.tutorials.highway.HighwayManagementApp()" ],
        "inductionLoops": [ "detector_0", "detector_1", "detector_2" ],
        "laneAreaDetectors": [ ]
    }
]
```

> All unit spawners could be realized in two different ways. The Deterministic Mapping produces the exact same sequence of mapped vehicles in every simulation run with regard to the given ratios at each point in time the simulation). The Stochastic Mapping results in a random order of mapped units.

#### Use Type Distributions in Complex Traffic Scenarios

In the case, you have many vehicle spawners defined and you want to distribute prototypes on those vehicles equally without defining them
again and again, you can use `typeDistributions`. By doing so, it is very simple to adjust the list of types and weights at only one place in the configuration file.

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

It is also possible to define and use OD (origin-destination) matrices by adding a ODMatrixMapper to the `matrixMappers`-list. Each MatrixMapper consists of a list of `points`, the vehicle-`types` to be used and the actual flow-values (`odValues`) between each of the points. It is possible to define multiple matrices. This way can achieve distinctively different compositions of the vehicle flows.

The MatrixMapper will be called before the actual execution of the simulation and will generate vehicle-spawners for the flow between each of the points.

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

### Unit Identifiers

Every traffic object in Eclipse MOSAIC has a globally unique string identifier. These identifiers are used to identify 
a traffic object in Eclipse MOSAIC as well as in different ambassadors. From user’s aspect, these identifiers will be seen in the log files which are generated after a simulation. The following table explains, which identifier belongs to which traffic object.

| **Traffic Object** | **Eclipse MOSAIC Internal ID** |
| ------------------ | ----------------------- |
| **Vehicle**        | `veh_<seq_nr>`           |
| **RSU**            | `rsu_<seq_nr>`           |
| **TMC**            | `tmc_<seq_nr>`           |
| **Traffic Light**  | `tl_<group_id>`         |

* `seq_nr` is the sequence number of simulated vehicles, RSUs, TMCs, each starting from zero.
* `group_id` is the group id of the traffic light.

---

##Basic Applications

Eclipse MOSAIC is shipped with several example applications which can be loaded on the vehicles. Next to the applications shipped with
the tutorial scenarios **Barnim** and **Tiergarten**, there are further example applications to be found on our website.

Additionally, we provide an ETSI conform application which implement specific CAM generation rules for vehicles 
(`org.eclipse.mosaic.fed.application.app.etsi.VehicleCamSendingApp`), which is described in the following:

#### ETSI Application for vehicles

This application generates ETSI data for its simulation unit (e.g. heading, position, speed and time for
vehicles). According to its configuration, the application then sends out CAMs to other vehicles in range.
Note that the messages are only send when the time lies between the configured minimum and maximum
interval.

Currently, the default configuration (`ETSIApplication.json`) for the ETSI application looks like this:

```json
{
    /* The maximum time offset (here 1 second) of sending CA-messages 
     * (the offset will be different for every single vehicle to avoid interference) */
    "maxStartOffset": 1000000000,  
    /* CAMs are sent at most every 1 second */
    "minInterval": 100000000,
    /* CAMs are sent at least every 1 second */
    "maxInterval": 1000000000,
    /* CAMs are sent when the position of the vehicle changes at least about 4 meters */
    "positionChange": 4,
    /* CAMs are sent when the heading of the vehicle changes at least about 4 degrees */
    "headingChange": 4,
    /* CAMs are sent when the velocity of the vehicle changes at least about 0.5 m/s */
    "velocityChange": 0.5
}
```
The CAMs sent out by this application consist of four parts:

* Header with generic information
* MessageBody
* TaggedValue list

First of all, generic information like protocol version and creation time stamp are transmitted. Normally
this data set follows a network beacon, already containing data like position and speed. Nevertheless
this functionality must be implemented in the network layer, i.e. in the network simulator. At
the moment this is not supported and is therefore compensated in the next message part, the message
body. The body contains vehicle awareness data, including data like vehicle width, length, position, speed, type and heading. 
However, the specification is not completely implemented. Last but not least a message can contain optional data. 
