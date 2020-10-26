---
title: Simple Network Simulator (SNS)
linktitle: Network - SNS
toc: true
type: docs
date: "2020-06-30T00:00:00+01:00"
draft: false
weight: 60
menu:
  docs:
    parent: simulators
---

The Simple Network Simulator (SNS) aims to provide simple and fast capabilities for the
transmission of V2X-messages using Ad hoc communication. In order to stay performant the simulator makes abstractions
in certain places. Those abstractions will be discussed later on.

## Configuration
The SNS offers some configurability regarding the way transmissions are simulated.

__Main Configuration:__

|Parameter                |Description                                                                                                      |type                    |Default Value                   |
|:------------------------|:----------------------------------------------------------------------------------------------------------------|:-----------------------|:-------------------------------|
|`maximumTtl`             | Defines the upper bound for the amount of hops a message can make. (Note: messages can have individual `ttl`'s) | int                    | `10`                           |
|`singlehopRadius`        | Fallback radius to be used for transmission, if no radius is defined in the `AdhocConfiguration`                | double                 | `509.4`                        |
|`singlehopDelay`         | A delay configuration for the direct communication between two nodes. ([See here]({{<relref "../extending_mosaic/delay_models.md" >}}))   | Delay  | `ConstantDelay       |
|`singlehopTransmission`  | This contains the transmission configurations for `lossProbability` and `maxRetries`.                           | CTransmission          | n/a                            |
|`adhocTransmissionModel` | A class extending `AdhocTransmissionModel`, this will decide the logic for transmissions.                       | AdhocTransmissionModel | `SimpleAdhoc TransmissionModel` |

> On default the SNS will use the `SimpleAdhocTransmissionModel` with a `ConstantDelay` using 0 as delay. This means it usually
> makes sense to specify the `AdhocTransmissionModel` explicitly and use a more realistic `Delay`.
__Example Configuration:__
```json
{
    "maximumTtl": 20,
    "singlehopRadius": 300.5,
    "singlehopDelay": {
        "type": "SimpleRandomDelay",
        "steps": 5,
        "minDelay": "1.5 ms",
        "maxDelay": "2.5 ms"
    }, 
    "singlehopTransmission": {
        "lossProbability": 0.0,
        "maxRetries": 0
    },
    "adhocTransmissionModel": {
        "type": "SimpleAdhocTransmissionModel",
        "simpleMultihopDelay": {
            "type": "GammaRandomDelay",
            "minDelay": "10 ms",
            "expDelay": "30 ms"
        },
        "simpleMultihopTransmission": {
            "lossProbability": 0.1,
            "maxRetries": 2 
        }
    }
}
```

## Transmission Logic
SNS differentiates between two types of Ad hoc transmissions, geographically- and topologically-scoped transmissions, which
generally are abbreviated with _GeoCast_ and _TopoCast_ respectively.  
GeoCasts are limited to _BroadCasts_. Accordingly, there is no explicit addressing
of receivers (other than 255.255.255.255), instead a destination area is specified. However, GeoCasts allow for multihop forwarding.  
TopoCasts on the other hand use means of IPv4 addressing to transmit messages. Since the SNS was not build to simulate transmissions using complex topology-constructs, TopoCasts
are limited to transmissions with a single hop. However, TopoCasts support _BroadCasts_ and _UniCasts_ (we are omitting Anycasts).
Most transmissions in the Ad hoc domain will be some form of Broadcast, meaning every reachable entity is eligible to
receive a message.  

{{< svg src="images/sns_transmission_logic_flowchart.svg" desc="This flowchart tells how different types of messages are handled internally." >}}

### TopoCasts
The only way of directly addressing entities is a _SingleHopUniCast_ (see figure below), the sender will try to address an entity
in its transmission range.
{{< figure src="../images/SingleHopUniCast.png" title="SingleHopUniCast: The RSU is directly addressing the green vehicle." >}}
The counterpart to that is a _SingleHopBroadCast_ (see figure below), this form of transmission is commonly used for CAMs (Cooperative Awareness Messages) 
and other types of intermediate warning messages to all entities in transmission range.  
{{< figure src="../images/SingleHopBroadCast.png" title="SingleHopBroadCast: The RSU is addressing all units in transmission range." >}}

### GeoCasts
As already explained, GeoCasts do not support direct addressing, so there is no form of UniCast. Instead of addressing
entities, GeoCasts specify a destination area in which a message should be distributed.
The SNS supports two ways to simulate GeoCasts.
A simple but performant model (`SimpleAdhocTransmissionModel`) & a fairly realistic model ( `SophisticatedAdhocTransmissionModel`).
 
The simple model assumes a transmission to all entities in the specified area, whereas the delay will be calculated using the configured delay-type and the successful reception will be determined by the uniformly distributed lossProbability.
The figure below depicts this behaviour 
{{< figure src="../images/SimpleMultiHop.png" title="Simple GeoBroadCast: The RSU is sending to all entities in the destination area. All arrows (transmissions) will have a uniquely calculated delay or possible loss." >}}

The realistic model accounts for possible transmission failures more accurately. The easiest case is that the sender itself is inside
of the destination area[^1] and will start a [Flooding Transmission](#flooding-transmission) within this area (see figure below).
{{< figure src="../images/FloodingTransmission.png" title="GeoBroadCast using [Flooding Transmission](#flooding-transmission). Note: the area is not limited to circles." >}}

[^1]: Or is able to communicate with an entity inside the destination area.

In case the sending entity is outside of the destination area, a [Forwarding Transmission](#approaching-transmission) has to
be executed first. This is can also be described as an _AnyCast_, since the goal of this transmission is to reach _any_ entity
inside the destination area. We try to achieve this by building a "chain" of entities, that will forward the message to the destination
are (see figure below).
{{< figure src="../images/ApproachingTransmission.png" title="Forwarding Transmission, by building a \"chain\" of vehicles." >}}

The SNS however never uses [Forwarding Transmissions](#approaching-transmission) individually, rather they are combined with a [Flooding Transmission](#flooding-transmission), which
will simulate a way, that GeaCasts can be implemented in reality. The figure below depicts this behaviour.
{{< figure src="../images/ApproachingAndFlooding.png" title="Forwarding Transmission followed by a [Flooding Transmission](#flooding-transmission) to realistically simulate GeoCasts." >}}

## Transmission Models
As already mentioned in the previous abstracts, the SNS supports different transmission models for different use cases.
Depending on the configuration of the SNS and the type of message send, different models will be used.
The models are located in the package `org.eclipse.mosaic.fed.sns.ambassador.model`. This chapter aims to give
a detailed inside in the workings of the models.

### `SimpleAdhocTransmissionModel`
This is the most basic of all transmission models and will be your model of choice if you are not interested in completely
accurate transmission results but care for performance. This model will approximate GeoCasts using the defined `simpleMultihopDelay`
and `simpleMultihopTransmission` parameters.
For TopoCasts the usual `singlehopDelay` will be used.
This model only checks, whether a potential receiver is inside the destination area and has enabled Adhoc capabilities.
If those conditions are met it will simulate the transmission by calculating an actual delay value and saving it into a
transmission-result. Such a result holds information of the success of the transmission, the delay-value, the amount of hops,
and the number of attempts. Though the amount of hops will always be 1 for this model.

### `SophisticatedAdhocTransmissionModel`
This model offers are more realistic simulation of adhoc transmissions, using an implementation of a greedy-forwarding and flooding
algorithm (see [here (greedy forwarding)](https://en.wikipedia.org/wiki/Geographic_routing) & 
[here (flooding)](https://en.wikipedia.org/wiki/Flooding_(computer_networking))). For TopoCasts this model behaves very
similarly to the `SimpleAdhocTransmissionModel`, since TopoCasts are always configured with only one hop. 
For GeoCasts however, this model follows the flowchart above, trying to "approach" a destination area if it can't be reached directly.
 
#### Approaching (Greedy forwarding)
Approaching can be imagined as building a "chain" of entities to reach an area. However, there is no
guarantee, that even if such a chain exists, it will be found. The way that this chain is build follows the subsequent steps:
* Start from the sender and collect all reachable entities.
* Choose out of all reachable entities the one, that is closest to any node in the destination area.
* Use the chosen node and repeat the first step.
* Repeat until either a node inside the destination area is reached, or the TTL (time to live) is exceeded.

By always choosing the node with the shortest distance to the destination area, we omit a lot of possible solutions.
Greedy Forwarding isn't optimal, but offers a performant approach for this problem. "Face Routing"-algorithms will always
find a path if one exists, however this hasn't been implemented yet (feel free to contribute :).
The figure below shows an example of those shortcomings, the message will be send using the green nodes and won't receive the destination
area, even though there is a possible "chain" using the yellow nodes.

{{< svg src="images/shortcomingsApproaching.svg" desc="This figure depicts a case were the Approaching Transmission wouldn't reach the destination area, even though there is a possible way. (The dashed lines represent the communication range)" >}}

#### Flooding
The implementation of Flooding is fairly equivalent as described on
[wikipedia](https://en.wikipedia.org/wiki/Flooding_(computer_networking)). Each entity forwards the message to all entities
in its communication range. Entities, that already received the message won't receive it again; this is different from many real-life
implementations, where messages are send to all reachable entities except the sender. However, since the simulation has total
knowledge of all simulated entities, it is easier to overcome a lot of the disadvantages, that flooding faces
in real world implementations.

#### Implementing your own `AdhocTransmissionModel`
If the implemented models don't suffice your needs you can easily implement your own.
Create a class extending `AdhocTransmissionModel` and implement the abstract methods for sending TopoCasts/GeoCasts.
A possible extension could be to allow for multihop TopoCasts, building an actual topology and transmit your
messages using that topology. Also, the aforementioned "Face-Routing" could be of interest. Additionally, the calculation
of delays could be made more realistic. 

## Accessing SNS-functionality from your applications
In order for your scenario to enable the SNS follow the steps [here]({{< ref "docs/building_scenarios/scenario_configuration.md#communication-simulators-cell-ns3-omnetpp-sns" >}}).
An overview of how to configure AdHoc-modules and usage of the API for Routing and Message-Building functions, 
can be found [here]({{< ref "docs/develop_applications/communication.md" >}}).
