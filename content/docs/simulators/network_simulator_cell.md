---
title: Cell Simulator
linktitle: Network - Cell
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  docs:
    parent: simulators
    weight: 7
---

The built-in Eclipse MOSAIC Cell Simulator enables the applications to use cellular network communication.
The simulation of cellular communication in Eclipse MOSAIC consists of two parts:
1. The Cellular Simulator itself and
2. The applications that can communicate over cellular networks in the Application Simulator

These changes are done in a generic way, making the cellular simulator exchangeable. Users interested
in a different kind of simulation of cellular communication may use other simulators and develop
ambassadors connecting them to Eclipse MOSAIC.

The Cellular Simulator in the current state consists of three main modules:
1. UplinkModule
2. GeocasterModule
3. DownlinkModule

The Geocaster module simulates a mandatory component for ITS communication. It is inspired by
the several architectures from research projects as simTD or CONVERGE to enable ITS use cases over
cellular networks. It mainly takes over the task of an addressing and routing component with geographic
knowledge to support geo-addressing. However, it also supports regular topological addressing.
The Uplink and DownlinkModule are responsible for the transmission simulation. They account for the
aspects of transmission delays, packet losses and available data rates. In this context,Uplink and Downlink
always refer to the direction towards respectively from the Geocaster. For instance, a transmission
from an Internet-based server towards a vehicle would include an Uplink between the server and the
Geocaster and a Downlink between the Geocaster and the vehicle. While the Uplink direction only allows
point-to-point communication (Unicast), the Downlink supports point-to-point (Unicast) as well as
point-to-multipoint (Multicast).

### CellAmbassador folder structure

The Eclipse MOSAIC Cell simulator can be configured via three distinct configuration files, which can be
found within the scenarios' folder structure:

```FOLDER
└─ <scenario_name>
   └─ cell
      ├─ cell_config.json ................ Cell ambassador configuration file
      ├─ network.json ..................... Network configuration file
      └─ regions.json ..................... Regions configuration file
```

The network and regions configuration files are referenced in the cellular ambassador configuration
file.

### Installation

This simulator does not need to be installed. It is delivered as part of the Eclipse MOSAIC-installation package.

### Configuration

We provide a cellular configuration file in the example scenarios of Tiergarten and Barnim. Please note
that in the default configuration of this scenario the Cellular Simulator is deactivated. To activate the
cellular simulator just enable the `cell` federate in the `scenario_config.json`:

```json
"federates": {
    ...
    "cell": true,
    ...
}
``` 

The central configuration for the cellular simulator in the file
`<scenarioName>/cell/cell_config.json` could look like this:

```Json
{
    "debugGeocasting": false,
    "visualizeRegions": true,
    "networkConfigurationFile": "network.json ",
    "regionConfigurationFile": "regions.json "
}
```

The `visualizeRegions-option` from the `cell_config.json` is used to write a KML-file that visualizes the
used cell regions. Google Earth can be used to display it.

The configuration for the global network in the cellular simulator in the file
`<scenarioName>/cell/network.json` could look like this:
```json
{
    "globalNetwork": {
        "uplink": {
            "delay": {
                "type": "ConstantDelay",
                "delay": "100 ms"
            },
            "transmission": {
                "lossProbability": 0.0,
                "maxRetries": 2
            },
            "capacity": 28000000
        },
        "downlink": {
            "unicast": {
                "delay": {
                    "type": "ConstantDelay",
                    "delay": "50 ms"
                },
                "transmission": {
                    "lossProbability": 0.0,
                    "maxRetries": 2
                }
            },
            "multicast": {
                "delay": {
                    "type": "ConstantDelay",
                    "delay": "100 ms"
                },
                "transmission": {
                    "lossProbability": 0.0
                },
                "usableCapacity": 0.6
            },
            "capacity": 42200000
        }
    }
}
```

### Server configuration
Newer versions of MOSAIC will be able to support a new type of simulation units, called servers. Right now traffic management
centers are handled in the same way as servers will be in the future. What differentiates servers from other units is, that
they are treated as having no geographical location and instead are located "inside the internet.". This concept omits prior shortcoming,
where one would have to configure RSU's as servers.  
Servers are also configured in the `network.json` as follows:
 ```json
 {
     "globalNetwork": {
            [...]
     },
     "servers": {
         {
             "id": "TestServer",
             "uplink": {
                 "delay": {
                     "type": "ConstantDelay",
                     "delay": "200 ms"
                 },
                 "transmission": {
                     "lossProbability": 0.5,
                     "maxRetries": 2
                 }
             },
             "downlink": {
                 "unicast": {
                     "delay": {
                         "type": "SimpleRandomDelay",
                         "steps": 5,
                         "minDelay": "100 ms",
                         "maxDelay": "200 ms"
                     },
                     "transmission": {
                         "lossProbability": 0.1,
                         "maxRetries": 2
                     }
                 }
             }
         },
         {
             [...]
         }
     }
 }
 ```
Servers get their configuration for the delay and retransmission models from the `network.json` and the configuration for the
capacity-module has to be made from within an application, by activating the `CellModule` and properly setting the bit rates.
This could look as follows:
```java
        getOs().getCellModule().enable(
                new CellModuleConfiguration()
                        .maxUlBitrate(10000)
                        .maxDlBitrate(10000)
        );
```
For the CellAmbassador to be able to recognize servers, the `group`-field in the mapping must match the `id`-field in the `network.json`,
this also allows for multiple servers to utilize the same configuration. A `mapping_config.json` using the configuration from
above could look as follows:

```json
{
    ...,
    "tmcs": [
        {
            "group": "TestServer",
            "applications": [ "TestApplication" ],
            "inductionLoops": [ ],
            "laneAreaDetectors": [ ]
        }
    ],
    ...
}
```

> Note that all bandwidths are given in bit per second and all delays in nanoseconds, unless explicitly defined differently.
> Also, every json configuration goes through a minifier, so comments are allowed in the configuration files. An example
> would be the comment before the `globalNetwork` option.

### Delay regions

Additionally, the user has the option to define regions with individual delays. This can be used to simulate
areas with bad reception, crowded areas etc.

The regions should be stored in `<scenarioName>/cell/regions.json`. An
example definition for a single region called `Ernst-Reuter-Platz` could look like this:

```Json
{
    "regions":[
        {
            "id": "Ernst-Reuter-Platz",
            "area": {
                "nw": { "lon":13.3249, "lat":52.5131 },
                "se": { "lon":13.3273, "lat":52.5125 }
            },
            "uplink": {
                "delay": {
                    "type":         "SimpleRandomDelay",
                    "steps":        4,
                    "minDelay":     "50 ms",
                    "maxDelay":     "200 ms"
                },
                 "transmission": {
                     "lossProbability": 0.8,
                     "maxRetries": 2
                },
                "capacity":         28000000
            },
            "downlink": {
                "unicast": {
                    "delay": {
                        "type":         "SimpleRandomDelay",
                        "steps":        3,
                        "minDelay":     "100 ms",
                        "maxDelay":     "200 ms"
                    },
                    "transmission": {
                        "maxRetries": 2
                    }
                },
                "multicast": {
                    "delay": {
                        "type":         "SimpleRandomDelay",
                        "steps":        3,
                        "minDelay":     "120 ms",
                        "maxDelay":     "220 ms"
                    },
                    "transmission": {
                        "lossProbability": 0.8
                    },
                    "usableCapacity":   0.6
                },
                "capacity":             42200000
            }
        }
    ]
}
```

Note that `nw` represents the upper-left (north-west) point of the rectangle and `se` the lower-right (southeast).
For further information about the possible options, please refer to the Eclipse MOSAIC API documentation.

The actual configuration of the uplink and the downlink modules for each region exhibits the identical
format as configuration of the globalNetwork in the `network.json`.

When no regions are found, or if a node (a vehicle) is not within a specified region, the globalNetwork
defined in the `network.json`-File will be used as the delay model.

### Transmission simulation

One of the most important feature of the cellular simulator is an estimation of the delay experienced
through the transport over the cellular network.

The cellular simulator offers various modes to estimate the delay of the transmissions. The type of
estimation is specified with by `delayType` for the uplink and downlink for each region. You may also refer to the
[Delay-Chapter](/docs/extending_mosaic/delay_models).

* `delay.type = ’ConstantDelay’`: The message is transmitted with the latency being exactly equal to delay.
* `delay.type = ’SimpleRandomDelay’`: The latency can assume different (randomly generated and uniformly distributed) values between 
`minDelay` and `maxDelay`. The number of different values is determined by `steps`.
* `delay.type = ’GammaRandomDelay’`: A gamma distribution is used to estimate the latency, with $ \alpha $ = 2 and  $ \beta $= 2. The
minimal delay `minDelay` is added to the result. The curve is fitted so that the maximum likelihood for the delay is exactly equal to
`expDelay`.
* `delay.type = ’GammaSpeedDelay’`: This mode closely resembles the GammaRandomDelay. Additionally, a penalty for the velocity with which
the node is moving is calculated. This penalty is then added to the original delay. The GammaRandomDelay and the GammaSpeedDelay are
derived from a measurement campaign during a research project at the DCAITI.

The two different modes for the downlink are `unicast` and `multicast` which are configured separately. Multicast aims to simulate the
features of Multimedia Broadcast Multicast Service (MBMS). The main difference in terms of the transmission for unicast and multicast
is the handling of undeliverable messages. For unicast, the options `lossProbability` and `maxRetries` are used. Pr is short for
packet retransmit and denotes the probability for a failed delivery and a subsequent retransmit. The maximum number of retries
for the retransmission is configured through the `maxRetries`-option. The probability of a successful
retransmit is recalculated on every try.

In case of multicast the `lossProbability` is used as packet loss rate. The value is factored into the delay calculation.
In contrast to the unicast, just one transmission attempt is made for multicast.

### Operation

Beside the transmission simulation, the Addressing and Routing is the other important aspect of the Cellular Simulator. This task is enabled by the Geocaster.

The Geocaster evaluates the message headers for cellular messages, which are created by the communicating applications in the Application Simulator. 

It supports the following addressing and casting schemes.

[**`CellTopocast`**](/docs/extending_mosaic/communication/#cellular-topocast) is the normal unicast, where the Geocaster simply resolves
the single receiver via theIPResolver. Hence, the CellTopocast directly routes the message further. Currently, Topocast doesn't allow 
broadcast or anycast addresses, but any transmission protocols (tcp, udp).

[**`CellGeoUnicast`**](/docs/extending_mosaic/communication/#cellular-geocast) addresses every node in the destination area individually.
In this way it takes a geographic address and results in a loop to generate multiple unicasts.

[**`CellGeoBroadcast`**](/docs/extending_mosaic/communication/#cellular-geobroadcast), which is basically MBMS, uses one broadcast to all
nodes in the destined regions.The MBMS uses the different transmission mode of multicast in the downlink. CellGeoUnicast as well as
CellGeoBroadcast require broadcast, but don’t allow tcp (as ack for broadcasts is denied).
