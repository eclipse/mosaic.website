---
title: Perception in Applications
linktitle: Perception
toc: true
type: docs
date: "2022-07-13T00:00:00+01:00"
draft: false
weight: 70
menu:
    docs:
        parent: develop_applications
        weight: 70
---

The [Application Simulator](/docs/simulators/application_simulator#eclipse-mosaic-application-simulator) bundles a perception module
for vehicle units. This module allows to emulate basic detection of other traffic entities using a field of view filter.
To warrant fast simulation MOSAIC utilizes a spatial index, which allows for quick pre-selection of relevant entities.

{{% alert note %}}
Currently, vehicles are the only units being able to perceive other units.
Additionally, only the perception of other vehicles and traffic lights is supported. 
{{% /alert %}}

## Configuration
The perception module can be configured in the `mosaic/scenarios/<scenario_name>/application/application_config.json`.
The most important configuration is the choice of a perception backend and its parameters.
For every perceivable unit-type exists a defined index. The current configuration for the vehicle index happens via the parameter
`vehicleIndex`, and for the traffic light index `trafficLightIndex`.
Current index implementations are shown in the table below:

| Perceived Objects | Index Name         | Description                                                                                                                                                                                                                                                                          | Configurable Parameters   |
|-------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| Vehicles          | `VehicleMap`       | An index using a hash map to store vehicles. Will be performant for small amount of vehicles, but slow for larger quantities.                                                                                                                                                        | n.a.                      |
| Vehicles          | `VehicleTree`      | An index using a quad-tree to store vehicles. Adds some overhead but is performant for larger quantities of vehicles, dynamically allocates memory.                                                                                                                                  | `splitSize`, `maxDepth`   |
| Vehicles          | `VehicleGrid`      | An index using a grid structure to store vehicles. Adds some overhead but is performant for larger quantities of vehicles, allocates memory required for cells at initialization.                                                                                                    | `cellWidth`, `cellHeight` |
| Vehicles          | `SumoIndex`        | A placeholder to use SUMO's [context subscription](https://sumo.dlr.de/docs/TraCI/Object_Context_Subscription.html) to provide surrounding vehicles. In our testings this is performant for small scenarios but has some bottleneck when many vehicles are simulated simultaneously. | n.a.                      |
| Traffic Lights    | `TrafficLightMap`  | An index using a hash map to store traffic lights. This will be sufficient for most cases, as traffic lights are inherently static (i.e., non-moving) objects, so that no position updates are necessary.                                                                            | n.a.                      |
| Traffic Lights    | `TrafficLightTree` | An index using a KD-tree to store traffic lights. Adds minimal overhead but should accelerate retrieving traffic lights in large scenarios immensely.                                                                                                                                | `bucketSize`              |
| Building Walls    | `WallIndex`        | An index using a KD-tree to store building walls. Note, that in order for walls to be retrievable they have to be added to the [scenario database](/docs/develop_applications/road_traffic).                                                                                         | `bucketSize`              |
Below is an example of a `application_config.json` on how to configure the perception using a grid index for vehicles
and the trivial index for traffic lights.
```json
{
    "perceptionConfiguration": {
        "vehicleIndex": {
            "type": "VehicleGrid",
            "cellWidth": "5m",
            "cellHeight": "5m"
        },
        "trafficLightIndex": {
            "type": "TrafficLightMap"
        },
        "wallIndex": {
            "type": "WallTree"
        }
    }
}
```
{{% alert note %}}
If no index is configured, perception for the respective units is disabled.
{{% /alert %}}

For more information on choosing a backend for your scenario see [here](/docs/extending_mosaic/perception_deep_dive).

**Application Configuration**  
In order to use the perception module from your application it has to be enabled first. Viewing angles can be defined between 0° and 360°,
while the range has to be larger than 0.
Configuration works analogously to the AdHoc- and Cell- Communication-Modules and is usually done at startup:
```java
private final static VIEWING_ANGLE = 120; // [degree]
private final static VIEWING_RANGE = 100; // [meter]

@Override
public void onStartup() {
    // set up the configuration for the perception module
    SimplePerceptionConfiguration perceptionModuleConfiguration = 
        new SimplePerceptionConfiguration(VIEWING_ANGLE, VIEWING_RANGE);
    // enable the perception module using the defined configuration
    getOs().getPerceptionModule().enable(perceptionModuleConfiguration);  
}
```

## Usage
**Vehicles**  
To get a list of vehicles in perception range the `getPerceivedVehicles()`-method is called:
```java
// get list of vehicles in perception range
List<VehicleObject> perceivedVehicles = getOs().getPerceptionModule().getPerceivedVehicles();
// log the list of perceived vehicle IDs
getLog().infoSimTime(this, "Perceived vehicles: {}",
        perceivedVehicles.stream().map(VehicleObject::getId).collect(Collectors.toList()));
```

The `VehicleObject`-class contains information about the perceived vehicles' position, speed, and heading, as well as its dimensions
(length, width, height).

**Traffic Lights**  
Retrieving all traffic lights in perception range is achieved using the `getPerceivedTrafficLights()`:
```java
// get list of traffic lights in perception range
List<TrafficLightObject> perceivedTrafficLights = getOs().getPerceptionModule().getPerceivedTrafficLights();
// log the list of perceived traffic light IDs
getLog().infoSimTime(this, "Perceived traffic lights: {}",
        perceivedTrafficLights.stream().map(TrafficLightObject::getId).collect(Collectors.toList()));
```

The `TrafficLightObject`-class contains information about the perceived traffic lights' position, state (i.e., green, red, ...), and
the incoming and outgoing lanes that are controlled by the individual signal.

{{% alert note %}}
The perception of traffic lights uses the position of the stop lines at the intersection, and this is the only 
{{% /alert %}}

## Perception Modifiers
The perception module can be configured with different `PerceptionModifier`s, which can be used
to emulate occlusion, false negatives, position areas, etc.
MOSAIC already implements three modifiers, `SimpleOcclusionModifier`, `WallOcclusionModifier`, `DistanceModifier` and `PositionErrorModifier`.

| Modifier                  | Description                                                                                                                                                                                           | Image                                                      |
|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------|
| `SimpleOcclusionModifier` | Emulates occlusion in a simplified manner by comparing angles between perceived vehicles and requiring a minimum angle between all other perceived vehicles.                                          | {{< figure src="../images/occlusion_modifier.svg" >}}      |
| `WallOcclusionModifier`   | Emulates occlusion of vehicles by buildings. Requires building information in the scenario database, which can be imported to the database using the `--import-buildings` option in scenario-convert. | {{< figure src="../images/wall_occlusion_modifier.svg" >}} |
| `DistanceModifier`        | Stochastic modifier that reduces perception probability with the distance to the ego vehicle.                                                                                                         | {{< figure src="../images/distance_modifier.svg" >}}       |
| `PositionErrorModifier`   | Applies a gaussian error to lateral and longitudinal distances of perceived vehicles.                                                                                                                 | {{< figure src="../images/position_modifier.svg" >}}       |

To configure modifiers they have to be passed to the `PerceptionModuleConfiguration`:
```java
private void enablePerceptionModule() {
    // filter to emulate occlusion
    SimpleOcclusionModifier simpleOcclusionModifier = new SimpleOcclusionModifier(3, 5);
    // filter to emulate occlusion by buildings
    WallOcclusionModifier wallOcclusionModifier = new WallOcclusionModifier();
    // filter to reduce perception probability based on distance to ego vehicle
    DistanceModifier distanceModifier = new DistanceModifier(getRandom(), 0.0);
    // filter adding noise to longitudinal and lateral
    PositionErrorModifier positionErrorModifier = new PositionErrorModifier(getRandom());

    SimplePerceptionConfiguration perceptionModuleConfiguration = new SimplePerceptionConfiguration(
            VIEWING_ANGLE, VIEWING_RANGE,
            simpleOcclusionModifier, wallOcclusionModifier, distanceModifier, positionErrorModifier
    );
    getOs().getPerceptionModule().enable(perceptionModuleConfiguration);
}
```
All configured modifiers will be executed in order of configuration.

{{% alert note %}}
Note: Evaluating perception modifiers requires many list operations, which is costly in terms of performance. Depending on the size
of your scenario you may want to limit usage.
{{% /alert %}}
