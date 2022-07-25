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

## Configuration
The perception module can be configured in the `mosaic/scenarios/<scenario_name>/application/application_config.json`.
The most important configuration is the choice of a perception backend and its parameters.
MOSAIC implements a *Trivial*, *QuadTree* and *Grid* backend, with *QuadTree* being the default setting.
Below is an example of a `application_config.json` on how to configure the *Grid* index.
```json
{
    "perceptionConfiguration": {
        "perceptionBackend": "Grid",
        "gridCellWidth": "5m",
        "gridCellHeight": "5m"
    }
}
```
For more information on choosing a backend for your scenario see [here](/docs/extending_mosaic/perception_deep_dive).

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

Currently, the module only supports the perception of other vehicles, but this will be extended in the future.

## Usage
To get a list of vehicles in perception range the `getPerceivedVehicles()`-method is called:
```java
// get list of vehicles in perception range
List<VehicleObject> perceivedVehicles = getOs().getPerceptionModule().getPerceivedVehicles();
// log the list of perceived vehicle IDs
getLog().infoSimTime(this, "Perceived vehicles: {}",
        perceivedVehicles.stream().map(VehicleObject::getId).collect(Collectors.toList()));
```

The `VehicleObject`-class contains information about the perceived vehicles' position, speed and heading.

## Perception Modifiers
The perception module can be configured with different `PerceptionModifier`s, which can be used
to emulate occlusion, false negatives, position areas, etc.
MOSAIC already implements three modifiers, `SimpleOcclusionModifier`, `DistanceModifier` and `PositionErrorModifier`.

| Modifier                  | Description                                                                                                                                                  | Image                                                 |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|
| `SimpleOcclusionModifier` | Emulates occlusion in a simplified manner by comparing angles between perceived vehicles and requiring a minimum angle between all other perceived vehicles. | {{< figure src="../images/occlusion_modifier.svg" >}} |
| `DistanceModifier`        | Stochastic modifier that reduces perception probability with the distance to the ego vehicle.                                                                | {{< figure src="../images/distance_modifier.svg" >}}  |
| `PositionErrorModifier`   | Applies a gaussian error to lateral and longitudinal distances of perceived vehicles.                                                                        | {{< figure src="../images/position_modifier.svg" >}}  |

To configure modifiers they have to be passed to the `PerceptionModuleConfiguration`:
```java
private void enablePerceptionModule() {
    // filter to emulate occlusion
    SimpleOcclusionModifier simpleOcclusionModifier = new SimpleOcclusionModifier(3, 5);
    // filter to reduce perception probability based on distance to ego vehicle
    DistanceModifier distanceModifier = new DistanceModifier(getRandom(), 0.0);
    // filter adding noise to longitudinal and lateral
    PositionErrorModifier positionErrorModifier = new PositionErrorModifier(getRandom());

    SimplePerceptionConfiguration perceptionModuleConfiguration = new SimplePerceptionConfiguration(
            VIEWING_ANGLE, VIEWING_RANGE,
            simpleOcclusionModifier, distanceModifier, positionErrorModifier
    );
    getOs().getPerceptionModule().enable(perceptionModuleConfiguration);
}
```
All configured modifiers will be executed in order of configuration.

{{% alert note %}}
Note: Evaluating perception modifiers requires many list operations, which is costly in terms of performance. Depending on the size
of your scenario you may want to limit usage.
{{% /alert %}}
