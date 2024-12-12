---
title: Cellular Communication in Applications
linktitle: Communication - Cell
toc: true
type: docs
date: "2024-11-20T00:00:00+01:00"
draft: false
weight: 50
menu:
  docs:
    parent: develop_applications
    weight: 50
---

Eclipse MOSAIC has different classes, which allow you to define the network type and the specific area where the
communication should occur. Cellular communication can be achieved with the built-in communication simulator [Eclipse MOSAIC Cell](/docs/simulators/network_simulator_cell).

Depending on the needs of the application, there are different approaches to solve the communication issue in Eclipse MOSAIC
simulations. It is possible to modify the selected communication mode dependent on requirements.

Generally, the following modes are available for cellular communication: 

 * Geographically-scoped broadcast
 * Geographically-scoped unicast
 * Topologically-scoped unicast

## General Configuration
The first step to enable your application to use communication capabilities, is to make sure it extends the `AbstractApplication`-class
with an `OperatingSystem` which provides a Cell module, such as `VehicleOperatingSystem`or `RoadSideUnitOperatingSystem`.
Additionally, if you want your application to act upon the reception or transmission of messages, make sure it implements the interface 
`CommunicationApplication`.
Afterward, you can enable the cellular communication module by following the instruction in [Cellular Configuration](#cellular-communication).

This example showcases the inheritance of an application class that can transmit and receive messages via Cell communication, once you have
enabled the module.
```java
public class CellApplication extends AbstractApplication<VehicleOperatingSystem> implements CommunicationApplication {}
```
---
 
## Cellular Communication

The cellular network is known from wireless mobile communication and the principle is to divide the entire geographic
area into several smaller parts called **"cells"**. Each cell has a fixed-location transceiver with a coverage ratio.

Eclipse MOSAIC enables the communication with all the existing vehicles via a geographically-scoped broadcast mode or direct communication 
via a geographically-scoped unicast in a specific area (circular, rectangular).
In contrast, the topologically-scoped unicast mode is not restricted to a specific area.


### Cellular Configuration
To enable and configure the Cell-module in your application you have to call the `enable`-method of your applications Cell-module.
Typically, you will do this inside the `onStartup()`-method to enable cell capabilities from the get-go.

Below is an example configuration defining maximal uplink and downlink bit rates.
```java
@Override
public void onStartup() {
    getOs().getCellModule().enable(new CellModuleConfiguration()
        .maxDownlinkBitrate(50 * DATA.MEGABIT)
        .maxUplinkBitrate(50 * DATA.MEGABIT)
    );
}
```

## Cellular Routing Modes
There are several different routing modes for cellular communication, that differ in the route finding and number of receiving entities.
The following is an introduction into the most commonly used modes and how to use them within Eclipse MOSAIC.

### Cellular Topologically-Scoped Unicast

Compared to geographically-scoped uni- or broadcast, the topologically-scoped unicast is totally independent of geographical conditions
and the addressing can be in the form of an IP-Address or a receiver-ID.

The next figure illustrates how the rightmost vehicle is communicating with vehicle below the RSU in topologically-scoped unicast mode.

{{< figure src="../images/cellular-topologically-scoped-unicast.png"
title="Topologically-scoped unicast for direct addressing without geographical constraints" numbered="true" >}}

The code example below shows how we can configure the requirements of the communication in topologically-scoped unicast mode.

```java
String receiverName = "veh_0";

MessageRouting routing = getOs().getCellModule().createMessageRouting()
        .destination(receiverName)
        .topological()
        .build();

getOs().getCellModule().sendV2XMessage(new MyV2XMessage(routing));
```

### Cellular Geographically-Scoped Unicast

Compared to a geographically-scoped broadcast, a geographically-scoped unicast addresses a receiver with a unique address.
Addressing can be in the form of an IP-Address or a receiver-ID (e.g. veh_0). Again, the communication area can be configured
as circular or rectangular.

Assume, the rightmost vehicle has a message which is addressed to the leftmost vehicle. In order to send the message, the sending vehicle
first examines whether the receiving vehicle is located within the transmission area. If this is the case, the
message will be transmitted. The figure below illustrates this procedure.

{{< figure src="../images/cellular-geographically-scoped-unicast.png"
title="Cellular geographically-scoped unicast to address a receiver within a defined area " numbered="true" >}}

The following methods are provided for configuring the transmission area (circle or rectangle) and the addressing to
the receiver(hostname or ip address):

* `.geographical(GeoCircle geoCircle) `
* `.geographical(GeoRectangle geoRectangle)`
* `.destination(byte[] ipAddress)`
* `.destination(Inet4Address ipAddress)`
* `.destination(String receiverName)`
* `.destination(NetworkAdress receiverName)`

```java
GeoCircle transmissionArea = new GeoCircle( GeoPoint.latlon(52.5, 13.2), 3000);

String receiverName = "veh_0";
MessageRouting routing = getOs().getCellModule().createMessageRouting()
        .destination(receiverName)
        .geographical(transmissionArea)
        .build();

getOs().getCellModule().sendV2XMessage(new MyV2XMessage(routing));
```

### Cellular Geographically-Scoped Broadcast

The principle function of the geographically-scoped broadcast is to communicate with all entities within a geographical area. Eclipse MOSAIC
offers the possibility to configure a specific geographical area which can be either a circular or a rectangular area.

The following figure shows the rightmost vehicle, which is sending a message to be received by all vehicles in the red area.
The sending vehicle sends this message to a cellular antenna, which distributes it to all vehicles in the area.

{{< figure src="../images/cellular-geographically-scoped-broadcast.png"
title="Illustration of geographically scoped broadcast in a specific circular area" numbered="true" >}}

A circular communication area can be defined by adding the method `.geographical(GeoCircle geoCircle)` to the message routing builder
from an Eclipse MOSAIC application, as shown below:

```java
GeoCircle transmissionArea = new GeoCircle(GeoPoint.latlon(52.5, 13.2), 3000);

MessageRouting routing = getOs().getCellModule().createMessageRouting()
        .broadcast()
        .geographical(transmissionArea)
        .build();

getOs().getCellModule().sendV2XMessage(new MyV2XMessage(routing));
```

A rectangular destination area can be defined similarly:

```java
GeoPoint pointA = GeoPoint.latlon(52.51355, 13.22000);
GeoPoint pointB = GeoPoint.latlon(52.52000, 13.21000);
GeoRectangle transmissionArea = new GeoRectangle(pointA, pointB);

MessageRouting routing = getOs().getCellModule().createMessageRouting()
        .broadcast()
        .geographical(transmissionArea)
        .build();

getOs().getCellModule().sendV2XMessage(new MyV2XMessage(routing));
```

### Multicast/Broadcast Services
Multicast/Broadcast Services (MBS) is a point-to-multipoint interface specification for cellular networks. It is designed to provide 
efficient delivery of broadcast and multicast services within a cell as well as within the core network. 
MBS is a specialization of geographically-scoped routing and therefore can only be used in combination with it.

The following methods are provided for configuring the use of MBS as a geographically-scoped routing protocol:
* `.mbs()`

As described above, this can only be used in combination with the `.geographical(GeaArea)` method, see the example below:

```java
GeoCircle transmissionArea = new GeoCircle( GeoPoint.latlon(52.5, 13.2), 3000);

String receiverName = "veh_0";
MessageRouting routing = getOs().getCellModule().createMessageRouting()
        .destination(receiverName)
        .geographical(transmissionArea)
        .mbs()
        .build();

getOs().getCellModule().sendV2XMessage(new MyV2XMessage(routing));
```

### Setting Protocol Types

By default, all cell messages use UDP, however you can set the protocol using the `.protocol(...)` method of the 
`CellMessageRoutingBuilder`:
```java 
String receiverName = "veh_0";

MessageRouting routing = getOs().getCellModule().createMessageRouting()
        .protocol(Protocoltype.TCP)
        .destination(receiverName)
        .topological()
        .build();

getOs().getCellModule().sendV2XMessage(new MyV2XMessage(routing));
```
---

## CAM - Implementation

A Cooperative Awareness Messages (CAM) consists of four parts:

*  Header with generic information
*  MessageBody
*  ServiceList
*  TaggedValue list

First, generic information like protocol version, creation time stamp are submitted. Normally this data set follows a network beacon, which already contains data like position and speed. Nevertheless, this functionality must be implemented in the network layer, that means in the network simulator. At the moment this is not supported and is therefore compensated in the next message part, the message body. The body can contain either RSU or Vehicle awareness data. In the first case, only the RSU type is submitted, but this probably changes with a new CAM specification. In the second case, we provide date like vehicle width, length, position, speed, type and heading. The specification is not completely implemented, especially acceleration data and light, brake status are missing. The third part of the CAM specification, the service list, is also not implemented. This will probably change, when a list of services is defined by the ETSI. Last but not least a message contains a tagged list, a key value map with optional data. This is fully implemented and is used for our traffic light CAM messages, which provide the traffic light status in such a list.

### User Defined Tagged Values

If you are required to exchange custom data within CAMs, the field UserTaggedValue can be used. For adding such data to the CAM, the application needs to implement the method `beforeGetAndResetUserTaggedValue()` from the `CommunicationApplication` interface. If a CAM is about to be sent, the custom data can be set using the `getOs().setUserTaggedValue(byte[])` method. The receiver can simple access the data by accessing the field directly from the received CAM message:

```java
    byte[] value = cam.getUserTaggedValue ();
    if (value  != null) {
        // read  user  tagged  value}
    }
```

### Timing Requirements

CAMs are generated by the CAM Management and passed to lower layers when any of following rules apply:
* maximum time interval between CAM generations: $1s$;
* minimum time interval between CAM generations: $0.1s$;
* generate CAM when absolute difference between current heading (towards North) and last CAM heading > $4 deg$;
* generate CAM when distance between current position and last CAM position > $5m$
* generate CAM when absolute difference between current speed and last CAM speed > $1ms$;
* These rules are checked latest every $100ms$;