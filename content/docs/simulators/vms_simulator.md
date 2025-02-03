---
title: Variable Message Signs Simulator
linktitle: Traffic - VMS
toc: true
type: docs
draft: false
weight: 21
menu:
  docs:
    parent: simulators
---

The VMS Simulator allows to define variable message signs on top of the existing traffic simulation. An additional
application for vehicles allows them to react upon VMS, which can be dynamically controlled.

## Installation

{{% alert extended %}}
The **VMS Simulator** is part of **[MOSAIC Extended](/download#overview)**.  
For further information on licenses, feel free to contact us via **[mosaic@fokus.fraunhofer.de](mailto:mosaic@fokus.fraunhofer.de)**.
{{% /alert %}}

## Overview

The VMS Simulator extends simulations with variable message signs (VMS), which could by dynamically controlled. A VMS can be placed anywhere along a road and
has, amongst others, the following properties:
- *Type* for different traffic sign semantics,
- *Road and lane(s)* it corresponds to,
- *Visibility* as a value telling how well a sign is visible for road users

The concept of a flexible sign type allows testing future traffic signs which are not existent at the moment and also common VMS types like:
- Speed limit signs
- Lane assignment signs (assigns a list of allowed vehicle types to a lane - e.g. Busses, Taxis or even Automated Vehicles)

Any properties of a VMS, beside its position and type, can be changed during the simulation.

In each simulation step the VMS Simulator informs vehicles about any VMS that is inside their sight distance. How
vehicles react on VMS can be modeled with the {{< link title="Application Simulator" href="/docs/simulators/application_simulator/">}}.

## Configuration

To enable vehicles to react to VMS in your simulation, your scenario must include the following additional files:

* `<scenario-name>/traffic-signs/traffic_signs_config.json`: General configuration of the ambassador.
* `<scenario-name>/traffic-signs/signs.xml`: Detailed configuration of all available variable message signs.
* `<scenario-name>/application/TrafficSignsVehicleApp.jar`: The jar file which contains the vehicle application to be able to react on VMS.
* `<scenario-name>/application/TrafficSignsVehicleApp.json`: Configuration for the vehicle application to react on VMS.

#### Enable VMS Ambassador
To enable the VMS Ambassador in your simulation activate it in `<scenario-name>/scenario_config.json`:

```xml
{
   ...,
    "federates": {
        "application": true,
        "sumo": true,
        "traffic-signs": true
    }
}
```

#### Configure the VMS Ambassador
Configuring the Traffic Sign Ambassador in `<scenario-name>/traffic-signs/traffic_signs_config.json`:

```json
{
    // Name of the XML file which contains the traffic signs
    "signsFilename": "signs.xml",

    // Path to the scenario database
    "database": "../application/<scenario-name>.db"
}
```

#### Define VMS
Currently implemented traffic signs:
* __Lane Assignment Sign__
  Lanes can be assigned to a specific vehicle type (Bus, Taxi, Autonomous Vehicle,...).
    - Vehicles that are not of the allowed vehicle class will try to change to a different lane as soon as possible.
    - If a Taxi drives on the leftmost lane, but the rightmost is assigned to Taxis only, it tries to change to that lane as soon as possible.
* __Speed Limit Signs__
  Speed limits can be set for specific streets or even lanes.
    - Vehicles driving on a lane with a speed limit change their maximum speed (SUMO parameter) to the value the sign specifies.
    - When vehicles change lane they adapt the new speed limit.
    - Vehicles do not prefer faster lanes.

{{% alert note %}}
- Generally, vehicles try to execute these maneuvers as soon as they see the traffic sign.
- Signs have a visibility that defines how good the sign is visible to drivers.
- Variable traffic signs can be changed during the simulation, i.e., by a Traffic Management Center (TMC) or other simulation units.
- The area of validity of a sign ends as soon another sign is placed downstream on the road and just before any on-ramp or crossing.
- The `x,y` coordinates of signs in the XML definition are SUMO coordinates.
- The visibility of signs is defined between `0.0` (not visible) and `1.0` (very good visible).
- A vehicle only reacts on an update of a variable traffic signs if the sign is in front of the vehicle. If the sign is behind the vehicle and it is updated, the vehicle misses the update.
- If a vehicle is not allowed to drive on any lane of the road, it stops.
  {{% /alert %}}

The file `<scenario-name>/traffic-signs/signs.xml` stores all traffic signs of the scenario.

The following examples show how to define speed limit signs:
```xml
<trafficsigns>
    <!-- Speed limit of 130km/h on all lanes of the specified edge. Not variable. -->
    <speedLimit id="speed-limit-sign-1"
                x="51421.50" y="58297.29"
                edge="4822486_685163613_31022629_31022620"
                visibility="1.0"
                variable="false"
                limit="36.1">
    </speedLimit>

    <!-- Three variable speed limit signs for each lane of the edge with different speed limits. -->
    <speedLimit id="speed-limit-sign-2"
                x="51421.50" y="58297.29"
                edge="4822486_685163613_31022629_31022620"
                visibility="1.0"
                variable="true"
                limit="36.1" >
        <lane index="0" limit="27.7" /> <!-- 100km/h on lane 0 -->
        <lane index="1" limit="33.3" /> <!-- 120km/h on lane 1 -->
        <lane index="2" limit="36.1" /> <!-- 130km/h on lane 2 -->
    </speedLimit>
</trafficsigns>
```

The following examples show how to define lane assignment signs:
```xml
<trafficsigns>
    <!-- Variable lane assignment sign that assignes all lanes of the specified edge to all vehicle classes.
            With this sign previous lane assignment signs can be neutraized.
            The sign has also a bad visibility. -->
    <laneAssignment id="lane-assignment-sign-1"
                    x="51419.73" y="58294.31"
                    edge="4822486_685163613_31022629_31022620"
                    visibility="0.3"
                    variable="true"
                    allowedVehicleClasses="ALL" >
    </laneAssignment>

    <!-- Three variable lane assignment signs with different vehicle class assignments per lane. -->
    <laneAssignment id="lane-assignment-sign-2"
                    x="51419.73" y="58294.31"
                    edge="4822486_685163613_31022629_31022620"
                    visibility="1.0"
                    variable="true"
                    allowedVehicleClasses="ALL" >
        <lane index="0" allowedVehicleClasses="Taxi Bus" /> <!-- The rightmost lane is assigned to busses and taxis only. -->
        <lane index="1" allowedVehicleClasses="Taxi" /> <!-- The center lane is assigned to taxis only. -->
        <lane index="2" allowedVehicleClasses="ALL" /> <!-- on the leftmost lane all vehicle types are allowed to drive. -->
    </laneAssignment>
</trafficsigns>
```

#### Let Vehicles React on VMS 

To equip vehicles with the `TrafficSignsVehicleApp` you need to add `com.dcaiti.mosaic.app.examples.trafficsigns.TrafficSignsVehicleApp` to the applications list of the vehicle in the `mapping/mapping_config.json`.

You can specify the duration after which vehicles shall react on traffic signs by adding the `reactionTime` parameter (in seconds) to the application in `mapping_config.json`:
```json
"applications": [
    "com.dcaiti.mosaic.app.examples.trafficsigns.TrafficSignsVehicleApp(10)"
]
```

You also may want to change the mean sight distance of vehicles and define a deviation for that.
You can do this by creating the file `application/TrafficSignsVehicleApp.json` and edit it as following:
```json
{
    // Mean sight distance of a driver in meters
    "meanSightDistance": 400.0,

    // Max. deviation of sight distance in meters
    "sightDistanceDeviation": 20.0
}
```

{{% alert note %}}
This configuration affects each vehicle that is equipped with the `TrafficSignsVehicleApp`.
{{% /alert %}}

### Change VMS During Simulation

With the following code snippets, you can change VMS dynamically during simulation:

```java
long timeToSend = 150 * TIME.SECOND;
String signId = "speed-limit-sign-1"; // As defined in <scenario-name>/trafficsigns/signs.xml
double newSpeedLimit = 13.89; // in m/s
TrafficSignSpeedLimitChange interaction = new TrafficSignSpeedLimitChange(
    timeToSend,
    signId,
    newSpeedLimit
);
getOs().sendInteractionToRti(interaction);
```
_Change variable speed limit sign._

```java
long timeToSend = 160 * TIME.SECOND;
String signId = "lane-assignment-sign-2"; // As defined in <scenario-name>/trafficsigns/signs.xml
int laneIndex = 0;
List<VehicleClass> allowedVehicleClasses = new ArrayList<>();
allowedVehicleClasses.add(VehicleClass.ElectricVehicle);
TrafficSignLaneAssignmentChange interaction = new TrafficSignLaneAssignmentChange(
    timeToSend,
    signId,
    laneIndex, // NOTE: If you don't provide a lane index here, all lanes are assigned to electric vehicles only.
    allowedVehicleClasses
);
getOs().sendInteractionToRti(interaction);
```
_Change variable lane assignment sign. Allow only Electric Vehicles for a specific lane._

The operating system of the traffic management centers (TMC's) also has a built-in support to adjust the VMS's. Using a negative lane index with speed assignments, will address all lanes. Here are some function call sequence examples with their signature that you can use:

```java
getOs().changeVariableMessageSignState(String signId, int laneIndex).openOnlyForVehicleClasses(VehicleClass... vehicleClass);
getOs().changeVariableMessageSignState(String signId, int laneIndex).setMaxSpeed(double speed);
```