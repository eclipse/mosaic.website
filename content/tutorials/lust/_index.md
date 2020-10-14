---
title:
linktitle: lust
toc: false
type: tutorials
date: "2019-05-05T00:00:00+01:00"
draft: false
---

# LuST

{{< button type="primary" link="https://github.com/lcodeca/LuSTScenario" title="Download LuST Tutorial" >}}

The **Luxembourg SUMO Traffic (LuST)** scenario is a traffic simulation scenario which aims to provide
realistic traffic patterns of a common mid-size European city during an average day ([see this paper](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=7906642)). This traffic
simulation scenario for SUMO has been developed by Lara Codecá et al. and is publicly available via
[this GitHub repository](https://github.com/lcodeca/LuSTScenario). 

## Learning Objectivies

The following tutorial shows, how the LuST scenario can be integrated into Eclipse MOSAIC in order to
assess your own mobile application at large scale. After completing this tutorial you will be able to:

* Integrate an external SUMO simulation scenario into Eclipse MOSAIC.

{{% alert note %}}
Also, you can use this scenario as a blueprint for integrating your own prepared SUMO scenarios into Eclipse MOSAIC.
{{% /alert %}}

{{< figure src="images/lust-overview.PNG" title="Overview of the simulation site of the LuST scenario" numbered="true" >}}

* Area: **156 km<sup>2</sup>**
* Total length of all roads: **930 km**
* Total length of highways: **89 km**
* Number of intersections: **4.473**
* Number of traffic lights: **203**
* Number of vehicles during 24h of simulation time: **215.526**

## Execute the LuST scenario with Eclipse MOSAIC

You can find a prepared Eclipse MOSAIC scenario for the LuST scenario in the pre-installed scenario directory.
However, to get this scenario working, you need to execute the following steps:

1. In the subdirectory sumo of the LuST scenario directory, you can find several scripts which will
help you to download the actual SUMO scenario fromthe official sources on GitHub. Depending
on which operating system you use and which version control system client you have installed,
you can use one of the provided batch or shell script files. If you do not have a git or svn client
installed, you can also manually download and unzip the SUMO scenario from [LuST Scenario](https://github.com/lcodeca/LuSTScenario). Please note that the SUMO scenario must be placed inside the
sumo subdirectory of the scenario.

2. In order to execute Eclipse MOSAIC with the scenario, you need to pass the given `defaults.xml` to the
executable. OnWindows, this can be done by executing Eclipse MOSAIC as follows:
```bat
mosaic.bat -u <user-id> -s LuST -d scenarios/LuST/defaults .xml -w 0
```
Please note that the execution of this scenariomight take a long time, due to the massive amount of
vehicles simulated in this scenario. If you want to assess your mobility applications in combination
with further simulators (e.g. Cell2), the simulationmight slow down even more.

Finally, you can map your own applications onto vehicles using the prepared `mapping_config.json`.
Please note that applications can only be mapped for each vehicle type (see limitations below). Furthermore,
you can activate any communication simulator, such as Cell2 or SNS, to integrate communication
simulation into your assessment.

## Current limitations

The integration of the LuST scenario is currently a work in progress and therefore not all features are
available. The following limitations currently exist:

* **No mapping of applications on single vehicles.** It is currently not possible to map applications on
single vehicles. Instead, only vehicle types can bemapped with them. Of course, the applications
are running solely on each simulated vehicle which belongs to the respective vehicle type.
* **No definition of own vehicle spawner.** Currently, all simulated vehicles are spawned by the SUMO
traffic scenario itself. There is no way to add additional vehicles via the *mapping_config.json.*
* **No routing capabilities in applications.** Applications cannot use the navigation module of the
vehicle. Furthermore, detailed information about the current route or the road position (upcoming
nodes, type of the current road) is also not available to the applications.
* **No valid support of traffic light applications.** The mapping of applications onto traffic lights has
not yet been tested.
* The LuST scenario has been developed for SUMO 0.32.0 and we can not ensure that newer versions
of SUMO still support this scenario. Please be also aware, that Eclipse MOSAIC does not support SUMO
0.32.0 any more, but only version 1.0.1 or higher.