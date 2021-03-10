---
title: Eclipse SUMO - Simulation of Urban MObility
linktitle: Traffic - Eclipse SUMO
toc: true
type: docs
draft: false
weight: 20
menu:
  docs:
    parent: simulators
---
**Eclipse SUMO** is a highly portable, microscopic and continuous road traffic
simulation tool. It is designed to handle large road networks faster than real-time and simulates each vehicle
 individually.

|                        |                                                      | |
|------------------------|------------------------------------------------------|-|
| **Operating System**   | GNU/Linux and Microsoft Windows                      | |
| **License**            | EPL-2.0                                              | |
| **Website**            | [https://www.eclipse.org/sumo/](https://www.eclipse.org/sumo/) | |
| **Supported versions** | Recommended version:<br>Full support:<br>Limited support: | {{< version of="sumo" >}}<br>{{< version of="sumo_full_support" >}}<br>{{< version of="sumo_limited_support">}} |
|                        |                                                      | |

### Installation

{{< button icon="external-link-alt" title="Download Eclipse SUMO" link="https://sumo.dlr.de/wiki/Downloads" >}}

Download the SUMO binary bundle or installer from the SUMO website. Linux users may build SUMO from the source code.
Please refer to the
SUMO Wiki for further information.

{{% alert note %}}
In order to run SUMO with Eclipse MOSAIC you need to make the SUMO binaries available system wide by adding the SUMO
binary folder to your
`PATH` environment variable. Alternatively, the environment variable `SUMO_HOME` can be used to
define the installation directory of SUMO.
{{% /alert %}}

{{% alert tip %}}
We recommend using the 64 bit version of SUMO if you want to simulate scenarios with large traffic networks.
{{% /alert %}}

### Configuration


This ambassador can be configured with a configuration file. The specific path is `<scenarioName>/sumo/sumo_config.json`.
If no such file exists, the following default configuration options are used:

```json
{ 
    "updateInterval": 1000, 
    "sumoConfigurationFile": "<scenarioName>.sumo.cfg", 
    "exitOnInsertionError": true, 
    "additionalSumoParameters": "--time-to-teleport 0  --seed 100000", 
    "subscriptions": [ "roadposition", "signals", "emissions" ],
    "subscribeToAllVehicles": true
}
```

{{% alert tip %}}
Read the detailed documentation of the [SUMO Configuration](/docs/mosaic_configuration/sumo_config).  
{{% /alert %}}

Next to `sumo_config.json`, the following configuration files are required for every SUMO simulation scenario:

```plaintext
└─ <scenario_name>
   └─ sumo
      ├─ <scenarioName>.net.xml .............. SUMO Network file
      ├─ <scenarioName>.sumocfg .............. SUMO configuration file
      └─ sumo_config.json .................... Ambassador configuraition file]
```

The SUMO configuration consists of sumo specific config files and the sumo-ambassador configuration
file. The main configuration file name must end with the suffix *.sumocfg, which needs to refer to the network.
The network file is mandatory and can be generated with the `scenario-convert` tool provided with Eclipse MOSAIC.

{{% alert warning %}}
When you are coming from SUMO you might notice the missing route file (`*.rou.xml`). This is because with Eclipse MOSAIC, 
the traffic definition (definition of vehicles, flows, vehicle types) is usually part of the Mapping configuration file. Routes
usually are defined in the Application database. You can however add route files to your scenario and mosaic will handle
all vehicles in coherence.
{{% /alert %}}

Vehicle related parameters, such as acceleration, maximum speed, and the like, are configured via the Mapping configuration file. However,
some SUMO specific parameters, like the car following model can only be configured in the `sumo_config.json`. For example, if you have
configured a vehicle type called `MyVehicle` in the Mapping configuration, you can set specific parameters for this type as following:

```json
{
    ...,
    "additionalVehicleTypeParameters": {
        "MyVehicle": {
            "carFollowModel": "IDM",
            "lcKeepRight": "10"
        },
        ...
    }
}
```

>Note: All parameters have to be specified as Strings.

Further information about SUMO and its configuration can be found in the official SUMO wiki.

### Using the SUMO GUI with Eclipse MOSAIC

It is also possible to use the graphical interface of SUMO in order to visualize and interact with the simulation.
To
achieve this, Eclipse MOSAIC can be configured to start the GUI process of SUMO as the federate rather than the
command
line interface. In order to use the SUMO GUI the file `<mosaic>/etc/runtime.json` needs to be edited.
Here, the entry
`org.eclipse.mosaic.fed.sumo.ambassador.SumoAmbassador` must be
replaced with
`org.eclipse.mosaic.fed.sumo.ambassador.SumoGuiAmbassador`.

{{% alert note %}}
Keep in mind to launch Eclipse MOSAIC with the argument `-w 0` in order to disable the watchdog timer.
Otherwise, it
would shut down Eclipse MOSAIC if the simulation is paused in the SUMO GUI.
{{% /alert %}}

## Adding Vehicles
The `SumoAmbassador` handles vehicles added via Mapping (*mapping vehicles*) and via SUMO route files (*sumo vehicles*).
There are however some caveats:
* *mapping vehicles* can drive on routes specified in route files, however *sumo vehicles* can't drive on routes specified in the scenario
database
* you can only map applications on *sumo vehicles'* vehicle types, however you can work around this limitation by using
  different vehicle types for different applications
* Stay away from giving your *sumo vehicles* the prefix `veh_` since this will most likely lead to your simulation crashing, because
  MOSAIC uses this as a prefix internally
* The vehicle types defined in Mapping and defined in route files can't share the same names

This duality of adding vehicles has some powerful use cases. For example, you can use an existing SUMO scenario and add your own
traffic via MOSAIC and equip all vehicles with applications.


## Deep dive: Route Files / Additional Files

In SUMO the route files (`<..>.rou.xml`) fulfill three main purposes supported by Eclipse MOSAIC:
1. Define vehicle types.
2. Define routes for vehicles.
3. Define vehicle departures to spawn vehicles with defined types (1.) on defined routes (2.)

These definitions can also be done in additional files (`<...>.add.xml`).

Route and vehicle departure definitions can also be handled by SUMO's **Tr**affic **C**ontrol **I**nterface (TraCI), which is also
the way Eclipse MOSAIC adds them to the simulation. This has the advantage that it can be done at runtime leading to a smaller overhead
before simulation start. Vehicle types however have to be defined in a route file, or an additional file before simulation start,
additional files have the advantage, that they are loaded before route files, which is helpful for our use case.
We write a new additional file (`mosaic_types.add.xml`), which contains types specified in Mapping and merges them
with the aforementioned `additionalVehicleTypeParameters` (Note: these are not validated in any form). The image below shows
a schematic view of how the configuration files and RTI components interact with each other.
{{< figure src="../images/sumo_route_files.svg" title="Schematic overview of vehicle type handling in Eclipse MOSAIC" >}}