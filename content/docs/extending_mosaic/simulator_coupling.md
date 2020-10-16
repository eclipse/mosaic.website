---
title: Simulator Coupling
linktitle: Simulator Coupling
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  docs:
    parent: extending_mosaic
    weight: 2
---

This section provides general information which helps to couple your own simulator with Eclipse MOSAIC. For a
successful coupling, two parts are required: the Federate Ambassador is the communication interface
between the RTI and your simulator. It implements predefined interfaces of the Eclipse MOSAIC core library
and is directly coupled with Eclipse MOSAIC. Second, your simulator needs to communicate with the Federate
Ambassador. For this purpose, you either need to implement your own protocol to control the simulator,
or use existing ones of your respective simulator (e.g. SUMO provides the TraCI byte buffer protocol).

---

## Implementing a Federate Ambassador
In order to simplify federate development and to make the usage of the mechanisms provided by the RTI
safer, an abstract class called `AbstractFederateAmbassador` is provided by the Eclipse MOSAIC core package.
It implements the `FederateAmbassador` interface and handles incoming interactions as well as time
advance grants according to the specified federate behaviour. When a federate implementation is making
use of the `AbstractFederateAmbassador` as a super class, it has to provide two information to the
superclass while constructing an instance of the class. These are:

* `isTimeConstrained`: The general way this parameter can be understood, is that if it is set to **true** 
the federate is sensitive towards the time stamp order of interactions. The `AbstractFederateAmbassador`
will then queue incoming interactions and request a time advance from the RTI in order to ensure that 
processing the received interaction is safe. At the time the requested time advance is granted, every 
queued interaction with a time stamp smaller or equal to the granted time will be delivered to the 
federate for processing. If set to **false**, incoming interactions will be forwarded immediately to 
the federate, thus resulting in a *receive-order* of interactions at the federate.

* `isTimeRegulating`: Specifies whether the federate will publish time stamped interactions and
thus can influence the time advances of other federates in the federation. If set to **true**, the `AbstractFederateAmbassador` 
will request time advances with respect to the specified lookahead
value of the federate in order to avoid that time management schedules the execution of other
federates while queued interactions are processed. If set to **false**, time advance requests that are
issued due to incoming interactions will be flagged with an unlimited lookahead, allowing the RTI to
schedule other federates while incoming interactions are processed.

{{< figure src="../images/flowchart_timeconstrained_timeregulating.png" title="Flowchart of Interaction handling" numbered="true" >}}

### Further notes
Coupling a multitude of different simulators and properly syncing them is a non-trivial task and requires a lot of effort in order to
function correctly. If you have read up on High Level Architecture before 
(have a look [here](https://en.wikipedia.org/wiki/High_Level_Architecture) and at the linked references) you might notice, that the 
previous flowchart does not completely reflect the proposed mechanisms. For instance, the `isTimeRegulating` flag has no effect, when the `isTimeConstrained`
flag is not set.  
So at some points you might stumble upon federates, which have their `isTimeConstrained` and `isTimeRegulating` flags set to different
values as you would expect. An example of this is the `ApplicationAmbassador`. One would expect it to be time-constrained as well as
time-regulating. This isn't the case though, because the `ApplicationAmbassador` implements its own time- and event-management,
which would interfere with the internal mechanisms.  
When implementing your own federate, you can use the existing ones as reference.

### Example
A federate that is `timeConstrained` and `timeRegulated` can handle a time stamped interaction
only after receiving a corresponding time advance grant. For that reason, the `AbstractFederateAmbassador`
caches the incoming interactions in a local queue and requests a time advance with the interactions
time stamp. After getting a grant for that time stamp, it forwards the interaction via the `processInteraction`
method call and afterwards invokes `processTimeAdvanceGrant` to allow the federate to proceed in its
local simulation time. In the activity diagram in the following figure, the process of handling of incoming interactions
with respect to the federate configuration is illustrated.

{{< figure src="../images/federate-sequence.jpeg" title="Sequence diagram illustrating the flow of information." numbered="true" >}}

### Integration into Eclipse MOSAIC

The first step to integrate a new component is the extension of the configuration file `etc/defaults.xml`.
An example for a federate configuration can be found in following listing.

```xml
<federates>
    [...]
    <federate class="com.dcaiti.vsimrti.fed.omnetpp.ambassador.OmnetppAmbassador">
        <id>omnetpp</id>
        <deploy>true</deploy>
        <start>true</start>
        <host>local</host>
        <port>4998</port>
        <config>omnetpp.ini</config>
        <subscriptions>
            <subscription>VehicleRegistration</subscription>
            <subscription>RsuRegistration</subscription>
            <subscription>TrafficLightRegistration</subscription>
            [...]
        </subscriptions>>
    </federate>
    [...]
</federates>
```

The following parameters are available:

* `class` - Attribute giving the full qualified name of the Java class which implements the Feder-
ateAmbassador interface.

* `id` - The id of the federate. This value should be as short as possible and will be also used for
identifying the configuration folder within scenarios.

* `deploy` - If set to true, the federate placed under bin/fed/<id> will be copied to the execution
host (according to the host configuration file).

* `start` - If set to true, the federate will be started by the federation management using the start
command specified in the configuration file or this implementation.

* `subscriptions` - A list of interaction names which the Federate Ambassador subscribes for. If any other
ambassador sends out one of those interactions, this ambassador will receive them.

---

## Interaction extension

Another possibility to extend Eclipse MOSAIC is to add a new interaction to the set of predefined interactions. In the following
figure, the abstract class `Interaction`, implemented interaction extensions, and a place holder for further
extensions (rectangles with grey fonts and a dotted border) are illustrated. When the InteractionManagement
forwards interactions among federates, it chooses the destination based on a interaction id and
an optional condition. Furthermore, it synchronizes the interaction delivery based on their times. The
abstract class `Interaction` offers these attributes but no further content. The exchanged content has to be
implemented by extending the class `Interaction`. The already implemented extensions cover the content
necessary to simulate common scenarios. However, for further scenarios further interactions might be
required.

{{< figure src="../images/mosaic-message-classes.png" title="Interaction classes and their relationships.." numbered="true" >}}
