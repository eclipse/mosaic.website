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
**Eclipse SUMO** is an highly portable, microscopic and continuous road traffic
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
Please refer to the SUMO Wiki for further information.

{{% alert note %}}
In order to run SUMO with Eclipse MOSAIC you need to make the SUMO binaries available system wide by adding the SUMO
binary folder to your `PATH` environment variable. Alternatively, the environment variable `SUMO_HOME` can be used to
define the installation directory of SUMO.
{{% /alert %}}

{{% alert tip %}}
We recommend using the 64 bit version of SUMO if you want to simulate scenarios with a big traffic network.
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

Next to `sumo_config.json`, the following configuration files are required for every SUMO simulation scenario:

```FOLDER
└─ <scenario_name>
   └─ sumo
      ├─ <scenarioName>.net.xml .............. SUMO Network file
      ├─ <scenarioName>.rou.xml .............. SUMO Route file
      ├─ <scenarioName>.sumocfg .............. SUMO configuration file
      └─ sumo_config.json .................... Ambassador configuraition file]
```

The SUMO configuration consists of sumo specific config files and the sumo-ambassador configuration
file. The main configuration file name must end with the suffix *.cfg, which needs to refer to the network and route
files. The network file is mandatory and should be generated with the `scenario-convert` tool provided with Eclipse
MOSAIC.

The `<scenarioName>.rou.xml` is optional and is generated automatically for each simulation run. The routes for each
vehicle are then usualy taken from the scenario database. However, those routes can be overriden by defining them
manually in the route file.

{{% alert warning %}}
__Eclipse MOSAIC ignores SUMOs *.rou.xml files__  
With Eclipse MOSAIC, the traffic definition (definition of vehicles, flows, vehicle types) is part of the Mapping
configuration file. Any vehicles or flows defined within the `<scenarioName>.rou.xml` are ignored and won't be simulated
by SUMO.
{{% /alert %}}

Vehicle related parameters, such as acceleration, maximum speed, and the like, are configured via the Mapping
configuration file. However, some SUMO specific parameters, like the car following model, needs to be configured
separately in the route file. For example, if you have configured a vehicle type called `MyVehicle` in the Mapping
configuration, you can set specific parameters for this type in the `<scenarioName>.rou.xml` as following:

```xml
<routes>
    <vType id="MyVehicle" carFollowModel="IDM" lcKeepRight="10">
</routes>
```

Further information about SUMO and its configuration can be found in the official SUMO wiki.

### Using the SUMO GUI with Eclipse MOSAIC

It is also possible to use the graphical interface of SUMO in order to visualize and interact with the simulation. To
achieve this, Eclipse MOSAIC can be configured to start the GUI process of SUMO as the federate rather than the command
line interface. In order to use the SUMO GUI the file `<mosaic>/etc/runtime.json` needs to be edited. Here, the entry
`org.eclipse.mosaic.fed.sumo.ambassador.SumoAmbassador` must be replaced with
`org.eclipse.mosaic.fed.sumo.ambassador.SumoGuiAmbassador`.

{{% alert note %}}
Keep in mind to launch Eclipse MOSAIC with the argument `-w 0` in order to disable the watchdog timer. Otherwise, it
would shut down Eclipse MOSAIC if the simulation is paused in the SUMO GUI.
{{% /alert %}}
