---
title: Application Interfaces
linktitle: Application Interfaces
toc: true
type: docs
date: "2022-07-20"
draft: false
weight: 30
menu:
  docs:
    parent: develop_applications
    weight: 30
---

Application interfaces handle call-backs to incoming events via their methods, like `onVehicleUpdated()`, called by the
application simulator. The following table lists all interfaces usable for application implementation, the type of unit as well as
important other interfaces it implements. Interface specific public methods which have to be implemented by the user are listed in the
"Provides" column. The elementary interface (`Application`) provides the methods `onStartup()`, `onShutdown()`. Implementation details
are given in [Development of applications](/docs/develop_applications).

| Interface | Applicable to | Provides | Description |
|-----------|---------------|----------|-------------|
| `Application / AbstractApplication`  | *all*         | `onStartup`, `onShutdown`                                                                 | Elementary application class providing an operating system                                                              |
| `ConfigurableApplication`            | *all*         |                                                                                           | Basic application class providing an operating system and a configuration, which automatically loaded from a JSON file. |
| `CommunicationApplication`           | *all*         | `onMessageReceived`, `onAcknowledgementReceived`, `onCamBuilding`, `onMessageTransmitted` | All applications that implement some form of V2X communication are to implement this interface.                         |
| `VehicleApplication`                 | vehicle       | `onVehicleUpdated`                                                                        | General vehicle funtionality                                                                                            |
| `ElectricVehicleApplication`         | vehicle       | `onBatteryStateUpdated`, `onChargingRequestRejected`                                      | Electric vehicle functionality                                                                                          |
| `TrafficSignAwareApplication`        | vehicle       | `onTrafficSignInvalidated`, `onTrafficSignNoticed`                                        | Used by vehicles which are aware of traffic signs.                                                                      |
| `TrafficLightApplication`            | traffic light | `onTrafficLightGroupUpdated`                                                              | Traffic light functionality                                                                                             |
| `TrafficManagementCenterApplication` | TMC           | `onInductionLoopUpdated`, `onLaneAreaDetectorUpdated`                                     | Traffic management functionality                                                                                        |
| `MosaicApplication`                  | *all*         | `onSumoTraciResponded`, `onInteractionReceived`                                           | Features that involve customized RTI-interactions of MOSAIC                                                             |


{{% alert note %}}
_All interfaces can be found in the package_ `org.eclipse.mosaic.fed.application.app.api.*`
{{% /alert %}}

For example, when implementing the `VehicleApplication`, your application is able to react on movements of the vehicle:

```java
public class MyApplication extends AbstractApplication<VehicleOperatingSystem> 
                           implements VehicleApplication 
{
    
  ...

  @Override
  public void onVehicleUpdated(VehicleData previous, VehicleData current) {
      ...
  }

  ...
}
```

To create a Road Side Unit application which should react on incoming V2X messages, one need to implement the `CommunicationApplication` interface.  

```java
public class MyRsuApplication extends AbstractApplication<RoadSideUnitOperatingSystem> 
                              implements CommunicationApplication 
{
    
  ...

  @Override
  public void onMessageReceived(ReceivedV2xMessage v2xMessage) {
      ...
  }

  ...
}
```

Of course, you can also combine the interfaces with each other.




