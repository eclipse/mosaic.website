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
The perception index for traffic lights and wall buildings is disabled by default and can be enabled if required.
Furthermore, the implementation of the vehicle index can be chosen from a defined set of alternatives, shown in the table below:

| Vehicle Index Type | Description                                                                                                                                                                                                                                                                          | Configurable Parameters   |
|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| `tree`             | An index using a quad-tree to store vehicles. The default implementation which is performant for larger quantities of vehicles. Memory is dynamically allocated.                                                                                                                     | `splitSize`, `maxDepth`   |
| `grid`             | An index using a grid structure to store vehicles. Shows slightly faster performance than the `tree` implementation in urban scenarios. Allocates memory required for cells at initialization.                                                                                       | `cellWidth`, `cellHeight` |
| `sumo`             | A placeholder to use SUMO's [context subscription](https://sumo.dlr.de/docs/TraCI/Object_Context_Subscription.html) to provide surrounding vehicles. In our testings this is performant for small scenarios but has some bottleneck when many vehicles are simulated simultaneously. | n.a.                      |

Below is an example of a `application_config.json` on how to configure the perception using a grid index for vehicles.

```json
{
    "perceptionConfiguration": {
        "vehicleIndex": {
            "enabled": true,
            "type": "grid",
            "cellWidth": "5m",
            "cellHeight": "5m"
        },
        "trafficLightIndex": {
            "enabled": true
        },
        "wallIndex": {
            "enabled": true
        }
    }
}
```

{{% alert note %}}
Indexes for traffic lights and buildings disabled by default, thus requiring explicit configuration to enable them.  
Note, that the wall index requires building information to be present in the scenario database.
{{% /alert %}}

For more information on choosing a backend for your scenario see [here](/docs/extending_mosaic/perception_deep_dive).

**Application Configuration**  
In order to use the perception module from your application it has to be enabled first. Viewing angles can be defined between 0° and 360°,
while the range has to be larger than 0.
Configuration works analogously to the AdHoc- and Cell- Communication-Modules and is usually done at startup:

```java
private final static double VIEWING_ANGLE = 120d; // [degree]
private final static double VIEWING_RANGE = 100d; // [meter]

@Override
public void onStartup(){
    // set up the configuration for the perception module
    SimplePerceptionConfiguration perceptionModuleConfiguration=
    new SimplePerceptionConfiguration(VIEWING_ANGLE,VIEWING_RANGE);
    // enable the perception module using the defined configuration
    getOs().getPerceptionModule().enable(perceptionModuleConfiguration);
}
```

## Usage

**Vehicles**  
To get a list of vehicles in perception range the `getPerceivedVehicles()`-method is called:

```java
// get list of vehicles in perception range
List<VehicleObject> perceivedVehicles=getOs().getPerceptionModule().getPerceivedVehicles();
// log the list of perceived vehicle IDs
getLog().infoSimTime(this,"Perceived vehicles: {}",
perceivedVehicles.stream().map(VehicleObject::getId).collect(Collectors.toList()));
```

The `VehicleObject`-class contains information about the perceived vehicles' position, speed, and heading, as well as its dimensions
(length, width, height).

**Traffic Lights**  
Retrieving all traffic lights in perception range is achieved using the `getPerceivedTrafficLights()`:

```java
// get list of traffic lights in perception range
List<TrafficLightObject> perceivedTrafficLights=getOs().getPerceptionModule().getPerceivedTrafficLights();
// log the list of perceived traffic light IDs
getLog().infoSimTime(this,"Perceived traffic lights: {}",
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
MOSAIC already implements several filters and modifiers: `SimpleOcclusion`, `BoundingBoxOcclusion`, `WallOcclusion`, `DistanceFilter`, `PositionModifier`, `DimensionModifier`, and `HeadingModifier`.

| Modifier               | Description                                                                                                                                                                                                                              | Image                                                      |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------|
| `BoundingBoxOcclusion` | Recommended occlusion model. Emulates occlusion in a simplified manner by checking occlusion for a configurable number of points along the bounding box of a vehicle and evaluating if a threshold of points is visible.                 | {{< figure src="../images/bb_occlusion_modifier.svg" >}}   |
| `SimpleOcclusion`      | Emulates occlusion in a simplified manner by comparing angles between perceived vehicles and requiring a minimum angle between all other perceived vehicles.                                                                             | {{< figure src="../images/occlusion_modifier.svg" >}}      |
| `WallOcclusion`        | Emulates occlusion of vehicles by buildings. Requires building information in the scenario database, which can be imported to the database using the `--import-buildings` option in [scenario-convert](docs/scenarios/scenario_convert). | {{< figure src="../images/wall_occlusion_modifier.svg" >}} |
| `DistanceFilter`       | Stochastic modifier that reduces perception probability with the distance to the ego vehicle.                                                                                                                                            | {{< figure src="../images/distance_modifier.svg" >}}       |
| `PositionModifier`     | Applies a gaussian error to lateral and longitudinal distances of perceived vehicles, adjusting perceived positions.                                                                                                                     | {{< figure src="../images/position_modifier.svg" >}}       |
| `HeadingModifier`      | Applies a gaussian error to the heading of the perceived vehicle. This modifier also rarely adjusts the heading to be rotated by 180°, which also occurs in reality. | {{< figure src="../images/heading_modifier.svg" >}}        |
| `DimensionsModifier`   | Applies a gaussian error to the width, length, and height of the perceived vehicle.                                                                                                                                                      | {{< figure src="../images/dimensions_modifier.svg" >}}     |

To configure modifiers they have to be passed to the `PerceptionModuleConfiguration`:

```java
private void enablePerceptionModule(){
    // filter to emulate occlusion
    BoundingBoxOcclusion boundingBoxOcclusion = new BoundingBoxOcclusion();
    // filter to emulate occlusion by buildings
    WallOcclusion wallOcclusion = new WallOcclusion();
    // filter to reduce perception probability based on distance to ego vehicle
    DistanceFilter distanceModifier = new DistanceFilter(getRandom(), 0.0);
    // modifier adding noise to longitudinal and lateral
    PositionModifier positionModifier = new PositionModifier(getRandom());
    // modifier adding noise to the dimension of the vehicles
    DimensionsModifier dimensionsModifier = new DimensionsModifier(getRandom());
    // modifier adding noise to the heading of the vehicles
    HeadingModifier headingModifier = new HeadingModifier(getRandom());    

    SimplePerceptionConfiguration perceptionModuleConfiguration = new SimplePerceptionConfiguration.Builder(VIEWING_ANGLE, VIEWING_RANGE)
        .withModifiers(boundingBoxOcclusion, wallOcclusion, distanceFilter, positionModifier, dimensionsModifier, headingModifier)
        .build();
    getOs().getPerceptionModule().enable(perceptionModuleConfiguration);
}
```

All configured modifiers will be executed in order of configuration.

{{% alert note %}}
Note: Evaluating perception modifiers requires many list operations, which is costly in terms of performance. Depending on the size
of your scenario you may want to limit usage.
{{% /alert %}}
