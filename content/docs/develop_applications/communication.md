---
title: Communication in Applications
linktitle: V2X Communication
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 3
menu:
  docs:
    parent: develop_applications
    weight: 3
---

Eclipse MOSAIC has different classes, which allow you to define the network type and the specific area where the
communication should occur. Communication can be achieved with external 
network simulators ({{< link tilte="OMNeT++" href="/docs/simulators/network_simulator_omnetpp/" >}}, [ns-3](/docs/simulators/network_simulator_ns3)) or one of the built-in communication simulators [SNS](/docs/simulators/network_simulator_sns)
or [Eclipse MOSAIC Cell](/docs/simulators/network_simulator_cell). Furthermore, for a better understanding it is important to consider the network types of Eclipse MOSAIC in more
detail.

* Cellular Communication
* Ad-hoc Communication

Depending on the needs of the application, there are different approaches to solve the communication issue in Eclipse MOSAIC
simulations. However, a distinction must be made between inter vehicle communication and Vehicle-to-X communication.
Also, it is possible to modify the selected communication mode dependent on requirements.

Generally, the following modes are available based on network: 

**Cellular Communication**
 * Geobroadcast
 * Geocast
 * Topocast

**Ad-hoc Communication**
 * Geobroadcast
 * Geocast
 * Topobroadcast
 * Topocast


---
 
## Cellular Communication

The cellular network is known from wireless mobile communication and the principle is to divide the entire geographic
area into several smaller parts called **"cells"**. Each cell has a fixed-location transceiver with a coverage ratio.

Eclipse MOSAIC enables the communication with all the existing vehicles via Geobroadcast mode or direct communication via
Geocast in a specific area (circular, rectangular). In contrast, the Topocast mode is not restricted to a specific area.

### Cellular Geobroadcast 

The principle function of the Geobroadcast is to communicate with all entities within a geographical area. Eclipse MOSAIC
offers the possibility to configure a specific geographical area which can be either a circular or a rectangular area. 

The following figure illustrates a vehicle ***veh_2*** which is communicating with the other 
vehicles(***veh_1***, ***veh_3***) within a radius **R**. 

{{< figure src="../images/tiergarten-geobroadcast-circular-area.png" title="Illustration of Geobroadcast in a specific circular area" numbered="true" >}}

A circular communication area can be defined with the `geoBroadCast(GeoCircle geoCircle)` from an Eclipse MOSAIC application,
as shown below:

```java
GeoCircle transmissionArea = new GeoCircle(GeoPoint.latlon(52.5, 13.2), 3000);

MessageRouting routing = getOs().getCellModule().createMessageRouting().geoBroadCast(transmissionArea);

getOs().getCellModule().sendV2XMessage(new MyV2XMessage(routing));
```

A rectangular destination area can be defined similarly:

```java
GeoPoint pointA = GeoPoint.latlon(52.51355, 13.22000);
GeoPoint pointB = GeoPoint.latlon(52.52000, 13.21000);
GeoRectangle transmissionArea = new GeoRectangle(pointA, pointB);

MessageRouting routing = getOs().getCellModule().createMessageRouting().geoBroadCast(transmissionArea);

getOs().getCellModule().sendV2XMessage(new MyV2XMessage(routing));
```

### Cellular Geocast

Compared to Geobroadcasting, a Geocast addresses a receiver with an unique address. Addressing can be in the form of an
IP-Address or a receiver-ID (e.g. veh_0). Again, the communication area can be configured as circular or rectangular.

Assume, the ***veh_1*** has a message which is addressed to ***veh_2***. In order to send the message, ***veh_1*** first
examines whether the vehicle with ID ***veh_2*** is located within the transmission area. If this is the case, the
message will be transmitted. In figure below is this situation illustrated.

{{< figure src="../images/tiergarten-geocast-circular-area.png" title="Cellular Geocast to address a receiver within a defined area " numbered="true" >}}

The following methods are provided for the configuring the transmission area (Circle or Rectangle) and the addressing to
the receiver(hostname or ip address).

* `geoCast(GeoCircle geoCircle, String receiverName) `
* `geoCast(GeoRectangle geoRectangle, String receiverName)`
* `geoCast(GeoCircle geoCircle, byte[] ipAddress)`
* `geoCast(GeoRectangle geoRectangle, byte[] ipAddress)`

```java
GeoCircle transmissionArea = new GeoCircle( GeoPoint.latlon(52.5, 13.2), 3000);

String receiverName = "veh_0";
MessageRouting routing = getOs().getCellModule().createMessageRouting().geoCast(transmissionArea, receiverName);

getOs().getCellModule().sendV2XMessage(new MyV2XMessage(routing));
```

### Cellular Topocast 

Compared to Geocast or Geobroadcast, the Topocast is totally independent of geographical conditions and the addressing
can be in the form of an IP-Address or a receiver-ID.

The next figure illustrates how the ***veh_0*** is communicating with ***veh_1*** in Topocast mode.

{{< figure src="../images/tiergarten-cellular-topocast.png" title=" Topocast mode for direct addressing without geographical constraints" numbered="true" >}}

The code example below shows how we can configure the requirements of the communication in Topocast mode.

```java
String receiverName = "veh_0";

MessageRouting routing = getOs().getCellModule().createMessageRouting().topoCast(receiverName);

getOs().getCellModule().sendV2XMessage(new MyV2XMessage(routing));
```

### Setting Protocol types

By default, all cell messages use UDP, however you can set the protocol using the `protocol(...)` method of the `MessageRoutingBuilder`:
```java 
String receiverName = "veh_0";

MessageRouting routing = getOs().getCellModule().createMessageRouting()
        .protocol(Protocoltype.TCP)
        .topoCast(receiverName);

getOs().getCellModule().sendV2XMessage(new MyV2XMessage(routing));
```
---

## Ad-hoc Communication

The Ad-hoc network does not rely on a pre-existing infrastructure. Provided that vehicles are equipped with Ad-hoc
modules, they are able to communicate with each other dynamically. In case of a sufficient number of Ad-hoc equipped
vehicles, a message can be transferred via hops quickly over a long distance.

Eclipse MOSAIC also enables the communication via a specific Ad-hoc channel within the wireless Ad-hoc network. However, the
Ad-hoc channels for vehicular communication are limited and standardized by the IEEE 802.11p.
The licensed frequency band 5.9 GHz (5.85-5.925 GHz) for Intelligent Transportation Systems(ITS) will be used as Ad-hoc
channels.

The following table shows the possible channels on the 5.9 GHz band used for V2X communication.

|Channel Number| 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|--------------| - | - | - | - | - | - | - |
|Channel Name  | SCH1| SCH2 | SCH3 | CCH | SCH4 | SCH5 | SCH6|
|Frequency Band| 5.86 | 5.87 | 5.88 | 5.89 |5.9 | 5.91 | 5.92 |

### Configuring AdHoc Capabilities
The first step to enable your application to use Ad hoc capabilities, is to make sure it extends the `AbstractSimulationUnit`-class
or one of its child-classes (e.g. `VehicleUnit`, `ChargingStationUnit`) found in package
`org.eclipse.mosaic.fed.application.ambassador.simulation`. Additionally, if you want your application to act upon
the reception or transmission of messages, make sure it implements the interface `CommunicationApplication`.  
Once this is done, make sure to configure and enable the AdHoc-module in your application. Below is an example configuration
taken from the Tiergarten-tutorial. Instead of configuring the `.power(...)[mW]` it is also possible to configure 
a `.distance(...)[m]`.
```java
// Example of AdHocConfiguration (see TiergartenVehicle.java) 
@Override
public void onStartup() {
    getOs().getAdHocModule().enable(new AdHocModuleConfiguration()
        .addRadio()
        .channel(AdHocChannel.CCH)
        .power(50)
        .create());
}
```

### Ad-hoc Topobroadcast

In Topobroadcast mode, the communication between vehicles is regardless of the geographic conditions. However, the
communicating entities must be operated on the same Ad-hoc channel and there are two options to use the Topobroadcast: 
* Singlehop
* Multihop 

#### Singlehop approach in Topobroadcast

For Singlehop, it is not necessary to specify the number of hops explicitly which indicates the lifespan of a message,
because in Singlehop, any message has a lifespan of **hop = 1**. Moreover, Eclipse MOSAIC allows to use the default method
`topoBroadCast()` which automatically assigns a Control Channel (CCH) for the simulation entity and a lifespan based on
the Singlehop principle. Alternatively you can use the non-default method `topoBroadCast(AdHocChannel)` in order to
specify the Ad-hoc channel.

Below are some configuration examples of the default addressing method `topoBroadCast()` and non-default addressing
method `topoBroadCast(AdHocChannel)`.

```java
MessageRouting routing = getOs().getAdHocModule().createMessageRouting().topoBroadCast();

getOs().getAdHocModule().sendV2XMessage(new MyV2XMessage(routing));
```

```java
AdHocChannel commonChannel = AdHocChannel.SCH1;

MessageRouting routing = getOs().getAdHocModule().createMessageRouting().topoBroadCast(commonChannel);

getOs().getAdHocModule().sendV2XMessage(new MyV2XMessage(routing));
```
The following figure shows a simplified model based on the Singlehop principle. The *veh_1* sends messages to all
simulation entites(***RSU***, ***veh_2***) that are using the same Ad-hoc channel. After transmission, the message can
no longer be forwarded by the receiver.

{{< figure src="../images/tiergarten-adhoc-topobroadcast-singlehop.png" title="Overview Singlehop with specified Ad-hoc channel" numbered="true" >}}

#### Multihop approach in Topobroadcast

In Multihop, the lifespan (amount of hops) of a message can be specified, allowing larger communication distances.

The following figure shows a Multihop example with a data package D (M, h = 2) from the vehicle *veh_0* which contains a
message M and a hop number h = 2. Assuming that a lot of simulation entities are using the same Ad-hoc channel the
message can be forwarded over a along distance. After each forward the hop number will be incremented by 1. Since the
hop amount was set to 2, the forwarding will stop after 2 increments.

{{< figure src="../images/tiergarten-adhoc-topobroadcast.png" title="Overview Multihop principle" numbered="true" >}}

The next code snippet shows a configuration example with an Ad-hoc channel and a message lifespan **hops = 2**.

```java
AdHocChannel commonChannel = AdHocChannel.SCH1;
int hops = 2;

MessageRouting routing = getOs().getAdHocModule().createMessageRouting().topoBroadCast(commonChannel, hops);

getOs().getAdHocModule().sendV2XMessage(new MyV2XMessage(routing));
```

{{% alert note %}}
In order to use the Multihop approach in OMNeT++ and ns-3 provided by Eclipse MOSAIC, its necessary to implement a
routing protocol in network simulators ([OMNeT++](/docs/simulators/network_simulator_omnetpp),
[ns-3](/docs/simulators/network_simulator_ns3)). But the built in communication simulator
[SNS](/docs/simulators/network_simulator_sns) includes a simple routing protocol "Flooding".
{{% /alert %}}

### Ad-hoc Topocast

In addition to the Topobroadcast, the communication in Topocast mode will be addressed explicitly to the recipient and
the addressing can be done either through receiver name (vehicle-ID e.g. veh_0) or the IP-Address of the vehicle.

```java
final byte[] ipv4Address = {127,36,50,4};

AdHocChannel commonChannel = AdHocChannel.SCH1;

int hops = 2;

MessageRouting routing = getOs().getAdHocModule().createMessageRouting().topoCast(ipv4Address, hops, commonChannel);

getOs().getAdHocModule().sendV2XMessage(new MyV2XMessage(routing));
```

### Ad-hoc Geobroadcast

In contrast to Cellular Network above, the simulation entities act as active communication part (transmitter and
receiver) and all simulation entities within range are getting messages in Geobroadcast mode.

As example in the following illustration, The vehicles ***veh_0***, ***veh_2***, ***veh_3*** and the ***RSU*** are
Ad-hoc equipped and there is no vehicle in the communication range of ***RSU***, therefore a hop is not possible to next
vehicle ***veh_0***. But the vehicles ***veh_2*** and ***veh_3*** are able to communicate with each other.

{{< figure src="../images/tiergarten-adhoc-network.png" title="Principle of Ad-hoc Geobroadcast mode" numbered="true" >}}

With the methods 
* `geoBroadCast(GeoCircle geoCircle)` 
* `geoBroadCast(GeoRectangle geoRectangle)` 

of the Eclipse MOSAIC class `AdHocMessageRoutingBuilder` ,we are able, to configure the required area as a circle or a
rectangle.
```java
GeoPoint center = GeoPoint.latlon(52.5, 13.2);

GeoCircle adHocModule = new GeoCircle(center, 3000);

MessageRouting routing = getOs().getAdHocModule().createMessageRouting().geoBroadCast(adHocModule);

getOs().getAdHocModule().sendV2XMessage(new MyV2XMessage(routing));
```
Analogous to the examples above, we can also configure the transmission area as a rectangle.

The next code snippet illustrates a possible configuration with a rectangular transmission area and a specified Ad-hoc
channel. 

```java
GeoPoint pointA = GeoPoint.latlon(52.51355, 13.22000);

GeoPoint pointB = GeoPoint.latlon(52.52000, 13.21000);

final double radius = 3000.0;

GeoRectangle transmissionArea = new GeoRectangle(pointA, pointB);

MessageRouting routing = getOs().getAdHocModule().createMessageRouting().geoBroadCast(transmissionArea, AdHocChannel.SCH1);

getOs().getCellModule().sendV2XMessage(new MyV2XMessage(routing));
```

### Ad-hoc Geocast

The class AdHocMessageRoutingBuilder only has one method for Geocasting mode,
 `geoCast(DestinationAddress destinationAddress, AdHocChannel adHocChannel)`. Communication is possible if the
 IP-address of receiver is known and both (receiver and transmitter) are on the same Ad-hoc channel.

{{% alert note %}}
In this context the name Geocast is misleading, because a geological condition is not necessary.
{{% /alert %}}

As you can see in the next picture, the RSU uses the Ad-hoc channel *SCH1* and several vehicles use different
Ad-hoc channels. Assuming the RSU tries to send a message to *veh_1* and has knowledge about the IP-Address of *veh_1*,
if the vehicle *veh_1* also uses the same channel *SCH1*, the transmission will be completed successfully.

{{< figure src="../images/tiergarten-geocast-adHoc.png" title="Ad-hoc Geocast communication between entities using the same channel" numbered="true" >}}

Below you can see a possible configuration.

```java
final byte[] ipv4Address = {127,36,50,4};

DestinationAddress destAddress = new DestinationAddress(ipv4Address);

AdHocChannel commonChannel = AdHocChannel.SCH1;

MessageRouting routing = getOs().getAdHocModule().createMessageRouting().geoCast(destAddress, commonChannel);

getOs().getAdHocModule().sendV2XMessage(new MyV2XMessage(routing));
```

## CAM - Implementation

A Cooperative Awareness Messages (CAM) consists of four parts:

*  Header with generic information
*  MessageBody
*  ServiceList
*  TaggedValue list

First, generic information like protocol version, creation time stamp are submitted. Normally this data set follows a network beacon, which already contains data like position and speed. Nevertheless, this functionality must be implemented in the network layer, that means in the network simulator. At the moment this is not supported and is therefore compensated in the next message part, the message body. The body can contain either RSU or Vehicle awareness data. In the first case, only the RSU type is submitted, but this probably changes with a new CAM specification. In the second case, we provide date like vehicle width, length, position, speed, type and heading. The specification is not completely implemented, especially acceleration data and light, brake status are missing. The third part of the CAM specification, the service list, is also not implemented. This will probably change, when a list of services is defined by the ETSI. Last but not least a message contains a tagged list, a key value map with optional data. This is fully implemented and is used for our traffic light CAM messages, which provide the traffic light status in such a list.

### User defined tagged values

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