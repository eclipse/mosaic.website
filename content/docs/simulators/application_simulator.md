---
title: Eclipse MOSAIC Application Simulator
linktitle: Application - Simulator
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 15
menu:
  docs:
    parent: simulators
---

The **Application Simulator** plays an important role in the simulation of vehicles and its functions. It provides the capability 
to model the application logic for different simulation units (e.g. vehicles, road side units (RSUs), traffic lights, and others) 
as well as possible interaction attempts between the units via different communication links.

## Installation

This simulator does not need to be installed. It is delivered as part of the Eclipse MOSAIC installation package.

## Configuration

The Application simulator offers configuration possibilities for several aspects, e.g.
1. the simulator itself
1. the developed and simulated application(s) (depending on the application)
1. the mapping.

In terms of the scenario folder structure, the configuration files are located in the folders, as outlined in the overview:

```plaintext
└─ <scenario_name>
   ├─ application
   |  ├─ application_config.json ............. Configuration file for the application simulator.
   |  ├─ <scenario_name>.db .................. Database file for navigation.
   |  ├─ YourApplication.jar ................. Application(s) to be simulated.
   |  └─ your_application_config.json ........ Optional configuration for application(s).
   └─ mapping
      └─ mapping_config.json ................. Configuration file for the application mapping.
```

The **Application Simulator** is configured in the file `<scenario_name>/application/application_config.json`.
It is not necessary to provide the file, as in this case of a non-existing file, the following default configuration options are used:

```json
{
    "messageCacheTime": "30s",
    "encodePayloads": true,
    "navigationConfiguration" : {
        "type": "database"
    }
}
```

Furthermore, depending on the deployed **Applications**, the applications itself may offer configuration options 
in custom configuration files (e.g. `EtsiApplication.json` or `EtsiApplication_veh_0.json` - [see below](#etsi-application-for-vehicles)).

{{% alert tip %}}
The **Mapping** configuration is presented in close detail in [Application - Mapping](/docs/simulators/application_mapping).  
{{% /alert %}}


## Application Architecture

Each simulation unit (e.g. vehicle, RSU, traffic light ..) can have different applications (depending on their application
[Mapping](docs/simulators/application_mapping). The applications
for the units are basically compiled JAVA classes, which **extend** the abstract class `AbstractApplication`. Those
classes have to be deployed as pre-compiled JAR files into the `application` folder of the simulated scenario.

{{< figure src="../images/application_overview.svg" title="Overview of interaction between applications and the unit's operating system with its modules. An example V2X message propagation is presented." >}}

### Application Operating System
The `AbstractApplication` possesses a unit-specific `OperatingSystem`, which allows interactions with the simulated parameters.
The operating system provides access to information like the current time or position of the units and could control unit-specific
actions (like `slowDown()` for vehicles).

As the interaction types for navigation (retrieving road network information and calculating routes) and communication (preparing and
sending messages) are more complex, they are separated into the specific modules `NavigationModule` (Navigation + Routing for
vehicles) / `RoutingModule` (Routing-only for static units) and `AdHocModule` / `CellModule` with APIs dedicated to their purpose.

The following table lists all modules a unit's operating system could provide.

| Module           | Description                                                                              |
| ---------------- | -----------------------------------------------------------------------------------------|
| NavigationModule | Full featured access to the central navigation component for vehicles                    |
| RoutingModule    | Access to routing functionalities for static units as RSUs                               |
| AdHocModule      | Communication via ad hoc mode, using WIFI or ITS G5 specific means (e.g. for addressing) |
| CellModule       | Communication via cellular services (different configuration / addressing modes)         |

> **Note:** The presented communication modules `AdHocModule`, `CellModule` are used for the sending part of a transmission. The message
> reception is realized by Application Interfaces provided by the `CommunicationApplication`.

### Application Interfaces
Application interfaces handle call-backs to incoming events via their methods, like `onVehicleUpdated()`, called by the
application simulator. The following table lists all interfaces usable for application implementation, the type of unit as well as
important other interfaces it implements. Interface specific public methods which have to be implemented by the user are listed in the
"Provides" column. The elementary interface (`Application`) provides the methods `onStartup()`, `onShutdown()`. Implementation details
are given in [Development of applications](/docs/develop_applications).

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

## Basic Applications

Eclipse MOSAIC is shipped with several example applications which can be loaded on the vehicles. Next to the applications shipped with
the tutorial scenarios **Barnim** and **Tiergarten**, there are further example applications to be found on our website.

Additionally, we provide an ETSI conform application which implement specific CAM generation rules for vehicles 
(`org.eclipse.mosaic.fed.application.app.etsi.VehicleCamSendingApp`), which is described in the following:

### ETSI Application for vehicles
This application generates ETSI data for its simulation unit (e.g. heading, position, speed and time for
vehicles). According to its configuration, the application then sends out CAMs to other vehicles in range.
Note that the messages are only send when the time lies between the configured minimum and maximum
interval.

Currently, the default configuration (`EtsiApplication.json`) for the ETSI application looks like this:

```json
{
    /* The minimal length in bytes assumed for the payload to be send with each CAM. */
    "minimalPayloadLength": 200,
    /* The maximum time offset (here 1 second) of sending CA-messages 
     * (the offset will be different for every single vehicle to avoid interference) */
    "maxStartOffset": "1s",  
    /* CAMs are sent at most every 1 second */
    "minInterval": "500ms",
    /* CAMs are sent at least every 1 second */
    "maxInterval": "1s",
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
