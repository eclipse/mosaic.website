---
title: Charging Station Simulator 
linktitle: E-Mobility - Charging 
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 111
menu:
  docs:
    parent: simulators
---

With the [Battery Simulator](emobility_simulator_battery), MOSAIC Extended offers advanced simulation for the processes of discharging and recuperation. For holistic scenarios, the **Charging Station Simulator** extends the modeling characteristics of electric vehicles as it validates charging requests from vehicles to control re-charging. An overview of how the simulators interact (and the used interactions) can be seen below.

## Installation

{{% alert extended %}} The **Charging Station and Battery Simulators** are part of [MOSAIC Extended](/download#overview).  
For further information on licenses, feel free to contact us via **[mosaic@fokus.fraunhofer.de](mailto:mosaic@fokus.fraunhofer.de)**.
{{% /alert %}}

## Overview

{{< figure src="../images/ChargingStation_Battery_InteractionFlowChart.svg" title="Overview of Battery & Charging Station Simulator interaction" >}}

As can be seen from the interaction-chart above, the Charging Station Simulator is receiving and processing the
`VehicleChargingStartRequest`-interactions. This involves checking if requested charging stations have available spaces, the vehicle is in
charging range and some additional constraints. Furthermore, if a vehicle moves out of charging range or is removed from simulation it will
automatically stop being charged. If a `VehicleChargingStartRequest` is successfully validated, a `BatteryChargingStart`-interaction is
forwarded to the Battery simulator. Additionally, whenever a charging station is updated (vehicle un-/docked) the ambassador sends a
`ChargingStationUpdate`-interaction to all subscribed simulators.

## Configuration

```plaintext
└─ <scenario_name>
   └─ charging
      └─ charging_config.json ................. Charging Station ambassador configuration file
```

The configuration of actual charging stations happens in the [Mapping configuration](application_mapping#entities). The only parameter
configured in the *charging_config.json* is a global parameter for the maximum range of a charging station. This allows for abstract
modeling of charging stations, without the need of being super accurate with the stop positions of vehicles.

### Example configuration

```json
{
    "chargingStationRange": "20m"
}
```
