---
title: Ad-Hoc Communication in Applications
linktitle: Communication - Ad-Hoc
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
communication should occur. Ad-Hoc communication can be achieved with external network simulators ([OMNeT++](/docs/simulators/network_simulator_omnetpp), 
[ns-3](/docs/simulators/network_simulator_ns3)) or the built-in communication simulator [SNS](/docs/simulators/network_simulator_sns).

Depending on the needs of the application, there are different approaches to solve the communication issue in Eclipse MOSAIC
simulations. It is possible to modify the selected communication mode dependent on requirements.

Generally, the following modes are available for ad-hoc communication:

 * Geographically-scoped broadcast
 * Geographically-scoped unicast
 * Topologically-scoped broadcast
 * Topologically-scoped unicast

## General Configuration
The first step to enable your application to use communication capabilities, is to make sure it extends the `AbstractApplication`-class
with an `OperatingSystem` which provides an Ad-Hoc module, such as `VehicleOperatingSystem`or `RoadSideUnitOperatingSystem`.
Additionally, if you want your application to act upon the reception or transmission of messages, make sure it implements the interface 
`CommunicationApplication`.
Afterward, you can enable the ad-hoc communication module by following the instruction in [Ad-hoc Configuration](#ad-hoc-configuration).

This example showcases the inheritance of an application class that can transmit and receive messages via Ad-Hoc communication, once you have
enabled the module.
```java
public class AdHocApplication extends AbstractApplication<VehicleOperatingSystem> implements CommunicationApplication {}
```
---

## Ad-hoc Communication

The Ad-hoc network does not rely on a pre-existing infrastructure. Provided that vehicles are equipped with Ad-hoc
modules, they are able to communicate with each other dynamically. In case of a sufficient number of Ad-hoc equipped
vehicles, a message can be transferred via hops quickly over a long distance.

### Ad-hoc Configuration
Make sure you set up your application as described in [General Configuration](#general-configuration).
Afterward, to configure and enable the AdHoc-module in your application you have to call the `enable`-method of your applications' 
Ad-hoc module and define a configuration.
Usually you will do this in the `onStartup()`-method to enable the module from the get-go.
Below is an example configuration taken from the Tiergarten-tutorial. Instead of configuring the `.power(...)[mW]` 
it is also possible to configure a `.distance(...)[m]`.
```java
@Override
public void onStartup() {
        getOs().getAdHocModule().enable(new AdHocModuleConfiguration()
                .addRadio()
                .channel(AdHocChannel.CCH)
                .power(50)
                .create());
        }
```

## Ad-hoc Routing Modes
There are several different routing modes for ad-hoc communication, that differ in the route finding and number of receiving entities.
The following is an introduction into the most commonly used modes and how to use them within Eclipse MOSAIC.

### Ad-hoc Topologically-Scoped Broadcast

In the topologically-scoped broadcast mode, communication between vehicles takes place regardless of the geographic conditions.
However, in theory the communicating entities must be operated on the same Ad-hoc channel. Remember, that the 
[SNS](/docs/simulators/network_simulator_sns) does not implement channels.

The most common use of an ad-hoc broadcast is to only reach the neighbors of the sending node. In this cast, it is necessary to explicitly
set the number of hops to one. This indicates, that the lifespan of the message is one and is not sent further, once it has been received.
To use the singlehop approach, Eclipse MOSAIC allows to use the method
`.singlehop()` in the `AdHocMessageRoutingBuilder`. This sets the number of hops a message can take, aka. the time to live (TTL) of the
message, to one. 

Below is a configuration example that sends a topologically-scoped singlehop broadcast over the default channel.

```java
MessageRouting routing = getOs().getAdHocModule().createMessageRouting()
        .singlehop()
        .broadcast()
        .topological()
        .build();

getOs().getAdHocModule().sendV2XMessage(new MyV2XMessage(routing));
```

The following figure shows a simplified model based on the singlehop principle. The *veh_1* sends messages to all
simulation entities(***RSU***, ***veh_2***) that are using the same ad-hoc channel. After transmission, the message can
no longer be forwarded by the receiver.

{{< figure src="../images/ad-hoc-topologically-scoped-broadcast.png" 
title="Topologically-scoped singlehop broadcast" numbered="true" >}}

### Ad-hoc Topologically-Scoped Unicast

Unlike with the topologically-scoped broadcast, the communication in topologically-scoped unicast mode will be addressed explicitly to 
the recipient. The addressing can be done either through receiver name (vehicle-ID e.g. "veh_0") or the IP-Address of the vehicle.

```java
final byte[] ipv4Address = {127,36,50,4};

int hops = 2;

MessageRouting routing = getOs().getAdHocModule().createMessageRouting()
        .hops(hops)
        .destination(ipv4Address)
        .topological()
        .build();

getOs().getAdHocModule().sendV2XMessage(new MyV2XMessage(routing));
```
{{< figure src="../images/ad-hoc-topologically-scoped-unicast.png"
title="Ad-hoc topologically-scoped unicast" numbered="true" >}}


### Ad-hoc Geographically-Scoped Broadcast

In Ad-Hoc communication the simulation entities act as active communication part (transmitter and
receiver). In geographically-scoped broadcast mode, all simulation entities within range and destination area are getting messages.

As example in the following illustration, the rightmost vehicle sends a message, that is supposed to be transmitted to all vehicles within
the specified area (red circle). This is done by greedily forwarding the message via other vehicles until a vehicle within the area is
reached. Then, this vehicle broadcasts the message to all other vehicles within the area.

{{< figure src="../images/ad-hoc-geographically-scoped-broadcast.png" 
title="Ad-hoc geographically-scoped broadcast" numbered="true" >}}

With the methods 
* `.geographical(GeoCircle geoCircle)` 
* `.geographical(GeoRectangle geoRectangle)` 

of the class `AdHocMessageRoutingBuilder`, we are able to configure the required area as a circle or a
rectangle.

```java
GeoPoint center = GeoPoint.latlon(52.5, 13.2);

GeoCircle adHocModule = new GeoCircle(center, 3000);

MessageRouting routing = getOs().getAdHocModule().createMessageRouting()
        .broadcast()
        .geographical(adHocModule)
        .build();

getOs().getAdHocModule().sendV2XMessage(new MyV2XMessage(routing));
```
Analogous to the examples above, we can also configure the transmission area as a rectangle.

The next code snippet illustrates a possible configuration with a rectangular transmission area and a specified Ad-hoc
channel. 

```java
GeoPoint pointA = GeoPoint.latlon(52.51355, 13.22000);

GeoPoint pointB = GeoPoint.latlon(52.52000, 13.21000);

GeoRectangle transmissionArea = new GeoRectangle(pointA, pointB);

MessageRouting routing = getOs().getAdHocModule().createMessageRouting()
        .broadcast()
        .geographical(transmissionArea)
        .build();

getOs().getAdHocModule().sendV2XMessage(new MyV2XMessage(routing));
```

### Ad-hoc Geographically-Scoped Unicast

The class `AdHocMessageRoutingBuilder` can be used to configure a geographically-scoped unicast. Communication via this mode is possible 
if the IP-address of the receiver is known, both (receiver and transmitter) are on the same Ad-hoc channel and the receiver is located in
specified `GeoArea`.

The following picture illustrates a geographically-scoped ad-hoc unicast with multiple hops. The rightmost vehicle is the sender and is
addressing the leftmost vehicle via IP-Address and a given area (the red circle). The geographical routing protocol finds a message 
routing using three hops, indicated by the black arrows.

{{< figure src="../images/ad-hoc-geographically-scoped-unicast.png" 
title="Ad-hoc geographically-scoped unicast" numbered="true" >}}

Below you can see a possible configuration.

```java
final byte[] ipv4Address = {127,36,50,4};
GeoPoint center = GeoPoint.latlon(52.5, 13.2);
GeoCircle receivingArea = new GeoCircle(center, 3000);

MessageRouting routing = getOs().getAdHocModule().createMessageRouting()
        .destination(destAddress)
        .geographical(receivingArea)
        .build();

getOs().getAdHocModule().sendV2XMessage(new MyV2XMessage(routing));
```

## Ad-hoc Channels
Eclipse MOSAIC also enables the communication via a specific Ad-hoc channel within the wireless Ad-hoc network. However, the
Ad-hoc channels for vehicular communication are limited and standardized by the IEEE 802.11p.
The licensed frequency band 5.9 GHz (5.85-5.925 GHz) for Intelligent Transportation Systems(ITS) will be used as Ad-hoc
channels.

The following table shows the possible channels on the 5.9 GHz band used for V2X communication.

| Channel Number | 0    | 1    | 2    | 3    | 4    | 5    | 6    |
|----------------|------|------|------|------|------|------|------|
| Channel Name   | SCH1 | SCH2 | SCH3 | CCH  | SCH4 | SCH5 | SCH6 |
| Frequency Band | 5.86 | 5.87 | 5.88 | 5.89 | 5.9  | 5.91 | 5.92 |

Channels can be set via the `.channel(AdHocChannel)` method that is part of the `AdHocMessageRoutingBuilder`.
```java
AdHocChannel commonChannel = AdHocChannel.SCH1;

MessageRouting routing = getOs().getAdHocModule().createMessageRouting()
        .channel(commonChannel)
        .broadcast()
        .topological()
        .singlehop()
        .build();

getOs().getAdHocModule().sendV2XMessage(new MyV2XMessage(routing));
```

{{% alert note %}}
The built-in Simple Network Simulator ([SNS](/docs/simulators/network_simulator_sns)) does not implement communication via different
channels. If that is the focus of your simulation, consider using a different network simulator like ([OMNeT++](/docs/simulators/network_simulator_omnetpp) or [ns-3](/docs/simulators/network_simulator_ns3)).
{{% /alert %}}