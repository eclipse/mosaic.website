---
title: Simulators Overview
linktitle: Overview
toc: false
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 10
menu:
  docs:
    parent: simulators
---

The runtime infrastructure of **Eclipse MOSAIC** couples different simulators and can't be run alone 
and, therefore, it requires pre-installed simulators. Each simulator coupled with the RTI of MOSAIC usually covers a specific 
domain (e.g. traffic, communication, application, electricity, or other). 

Each of the simulators must implement an interface, the so-called `Ambassador`. 
The ambassador communicates with the actual simulator, which is represented by the `Federate`. 
For some cases, if the simulator is directly coupled with the RTI (e.g. Application, or cell), the ambassador also 
represents the federate. This architecture allows a simple coupling of own simulators.

{{< svg src="images/simulators_overview.svg" >}}

**The following simulators are coupled already with MOSAIC:**

<style>
table th:first-of-type {
    width: 26%;
}
</style>

| Domain | Simulator Name | Description |  
|-|-|-|
| **Application Simulation** | **[MOSAIC Application](application_simulator)** | Application prototyping and simulation. |
|                            | **[MOSAIC Mapping](application_mapping)** | Defining simulation entities, traffic, and mapping of applications. |
||
| **Traffic / Vehicle Simulation** | **[Eclipse SUMO](traffic_simulator_sumo)** | Microscopic Traffic simulation. |
|                                  | **PHABMACS** *     | Sub-microscopic vehicle simulation with 3D visualization. <br> _Documentation will be published soon._ |
||
| **Network / Communication Simulation** | **[OMNeT++](network_simulator_omnetpp)** | Event-based network simulator for ITS-G5 and cellular communication. |
|                                        | **[ns-3](network_simulator_ns3)** |  Event-based network simulator for ITS-G5 and cellular communication. |
|                                        | **[MOSAIC Simple Network Simulator](network_simulator_sns)** | Simulator for ITS-G5 ad-hoc communication using simplified models. |
|                                        | **[MOSAIC Cell](network_simulator_cell)** |  Simulator for cellular communication. |
||
| **Environment Simulation** | **[MOSAIC Environment](environment_simulator)** | Environmental event simulation. |
||
| **E-Mobility Simulation** | **[MOSAIC Battery](battery_simulator)** * | Electric vehicle simulation. |

*) _Only part of the [MOSAIC Extended](/download) bundle._
