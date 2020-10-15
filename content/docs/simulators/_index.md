---
title: Overview
linktitle: Overview
toc: false
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  docs:
    parent: simulators
    weight: 1
---

# Overview

The runtime infrastructure of **Eclipse MOSAIC** couples different simulators and can't be run alone 
and, therefore, it requires pre-installed simulators. Each simulator coupled with the RTI of MOSAIC usually covers a specific 
domain (e.g. traffic, communication, application, electricity, or other). 

Each of the simulators must implement an interface, the so-called `Ambassador`. 
The ambassador communicates with the actual simulator, which is represented by the `Federate`. 
For some cases, if the simulator is directly coupled with the RTI (e.g. Application, or cell), the ambassador also 
represents the federate. This architecture allows a simple coupling of own simulators.

```mermaid
graph BT;
    rti[Eclipse MOSAIC RTI]
    sumo[Eclipse SUMO]
    omnetpp[OMNeT++]   
    ApplicationAmbassador-->rti;
    sumo-->|TraCI|SumoAmbassador<-->rti;
    omnetpp-->|Protobuf|OmnetppAmbassador-->rti;
```
---

The following simulators are already coupled with MOSAIC:

<style>
table th:first-of-type {
    width: 25%;
}
table th:nth-of-type(2) {
    width: 75%;
}
</style>


## Traffic / Vehicle Simulation

||| 
|-|-|
| [**Eclipse SUMO**](</docs/simulators/sumo/>) | Microscopic Traffic simulation. |
| **PHABMACS**     | Sub-microscopic vehicle simulation with 3D visualization. |

## Network / Communication Simulation

||| 
|-|-|
| [**OMNeT++**](</docs/simulators/omnetpp/>) | Event-based network simulator for ITS-G5 and cellular communication. |
| [**ns-3**](</docs/simulators/ns-3/>) |  Event-based network simulator for ITS-G5 and cellular communication. |
| [**MOSAIC Simple Network Simulator**](</docs/simulators/sns/>) | Simulator for ITS-G5 ad-hoc communication using simplified models. |
| [**MOSAIC Cell**](</docs/simulators/cell/>) |  Simulator for cellular communication. |

## Application Simulation

|||  
|-|-|
| [**MOSAIC Application**](</docs/simulators/application_simulator/>) | Application prototyping and simulation. |

## Environment Simulation 

||| 
|-|-|
| [**MOSAIC Environment**](</docs/simulators/environment_simulator/>) | Environmental event simulation.|

## E-Mobility Simulation 

||| 
|-|-|
| [**MOSAIC Battery**](</docs/simulators/battery_simulator/>) | Electric vehicle simulation. |