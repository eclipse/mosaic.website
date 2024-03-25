---
title: Unit Operating System
linktitle: Operating System
toc: true
type: docs
date: "2022-07-20"
draft: false
weight: 40
menu:
  docs:
    parent: develop_applications
    weight: 40
    identifier: "operating_system"
---

In order to define the type of unit your application can run on, you need to speficy the operating system by choosing one of the following:

* `VehicleOperatingSystem` - for applications mapped to normal vehicles.
* `ElectricVehicleOperatingSystem` - for applications for vehicles with electro mobility features.
* `RoadSideUnitOperatingSystem` - for applications mapped to RSUs.
* `TrafficLightOperatingSystem` - for applications mapped to traffic lights.
* `TrafficManagementCenterOperatingSystem` - for applications mapped to TMCs.
* `ChargingStationOperatingSystem` - for applications mapped to charging stations.

For example:

```java
public class MyVehicleApplication extends AbstractApplication<VehicleOperatingSystem> {
  ...    
}
```

```java
public class MyRsuApplication extends AbstractApplication<RoadSideUnitOperatingSystem> {
  ...    
}
```

{{% alert note %}}
_For more information see package:_ `org.eclipse.mosaic.fed.application.app.api.os.*`
{{% /alert %}}

## Using the Operating System

Each application has access to the operating system of its unit. Depending on the type of unit, the operating system provides different methods. For example,
an application which is mapped on vehicles, has access to the `VehicleOperatingSystem` by calling `this.getOperatingSystem()` (or `this.getOs()` to keep it short). The following examples show a bit
of the capabilities the `VehicleOperatingSystem` provides:

Get the current simulation time (in nanoseconds):
```java
long time = this.getOs().getSimulationTime();
```
Return the name of the unit (e.g. "veh_0"):
```java
String nameOfUnit = this.getOs().getId();
```
Get access to vehicle data, such as speed, position, heading, and the like:
```java
double speed = this.getOs().getVehicleData().getSpeed();
GeoPoint position = this.getOs().getVehicleData().getPosition();
``` 
Change parameters of the vehicle during the simulation, such as its maximum speed:
```java
this.getOs().requestVehicleParametersUpdate()
        .changeMaxSpeed(10) // m/s
        .changeMaxAcceleration(2.4)
        .apply();
``` 
Get the current lane index of the vehicle and change lane to left (within 5 s):
```java
int laneIndex = this.getOs().getRoadPosition().getLaneIndex();
int newLaneIndex = Math.max(0, laneIndex - 1);
this.getOs().changeLane(newLaneIndex, 5 * TIME.SECONDS);
```
Sending a V2X message via ITS-G5 singlehop broadcast:
```java
MessageRouting routing = this.getOs().getAdHocModule().createMessageRouting().topoBroadCast();
V2xMessage message = new MyV2xMessage(routing);
this.getOs().getAdHocModule().sendV2xMessage(message);
```
Park the vehicle in 200 meters at the right side of the road for 3 minutes:
```java
double distance = 200;
double duration = 3 * 60 * 1000;
IRoadPosition stopPosition = RoadPositionFactory.createAlongRoute(
        getOs().getNavigationModule().getRoadPosition(),
        getOs().getNavigationModule().getCurrentRoute(),
        0,
        distance
);
this.getOs().stop(distance, duration, Stop.StopMode.PARK);
```

### Learn More About Operating System Modules

- [Navigation Module](/docs/develop_applications/navigation)
- [Communication Module](/docs/develop_applications/communication)
- [Perception Module](/docs/develop_applications/perception)