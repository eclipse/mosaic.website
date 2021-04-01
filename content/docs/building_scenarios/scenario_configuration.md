---
title: Additional Scenario Configuration
linktitle: Additional Scenario Configuration
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 30
menu:
  docs:
    parent: building_scenarios
---

This chapter aims to give you a brief overview of additional simulators and visualizers that can be used with Eclipse MOSAIC.
We will continue with the tutorial-style explanations following up on the Steglitz-example from the
[previous chapter](scenario_convert). For more detailed explanations of the configurations have a
look at [this chapter](/docs/building_scenarios).  
If you already played with the [Barnim](/tutorials/barnim_basic)-tutorial you probably noticed, that it contains far
more folders in the scenario structure compared to the Steglitz example. Those additional directories contain
configurations for various simulators.

```plaintext
└─ Barnim
   ├─ application
   ├─ cell
   ├─ environment
   ├─ mapping
   ├─ ns3
   ├─ output
   ├─ sns
   ├─ sumo
   └─ scenario_config.json .................. Basic configuration of the simulation scenario
```

## Let the cars loose

As a starting point we'll look at the scenario that we created using this command:
```
java -jar scenario-convert.jar --osm2mosaic -i steglitz.osm -o --generate-routes
--route-begin-latlon 52.4551693,13.3193474 --route-end-latlon 52.4643101,13.3206834 --number-of-routes 3
```
We'll end up with a folder looking like this:

```plaintext
└─ steglitz
   ├─ application
   |  └─ steglitz.db
   ├─ mapping
   |  └─ mapping_config.json
   ├─ sumo
   |  ├─ steglitz.net.xml
   |  └─ steglitz.sumocfg
   └─ scenario_config.json .................. Basic configuration of the simulation scenario
```

If you have a look in the [mapping_config.json](/docs/building_scenarios/files/steglitz_mapping_config.json), 
you can see that the scenario-convert script automatically assigns cars to the three routes created. You can use this
file as a blueprint for your own scenario, have a look [here](/docs/building_scenarios#applications-and-mapping)
to get more details on possible adaptions.  
Below is a short video of the scenario displayed in the SUMO-GUI. We marked the three different routes the cars
follow.

{{< video src="../images/steglitz_routes.mp4" controls=true >}}

## Communication Simulators (cell, ns3, omnetpp, sns)

We won't implement any functionality for the steglitz example here but rather have a look at the
[Barnim](/tutorials/barnim_basic/)-tutorial. In the `scenario_config.json` of the Barnim scenario you can see where the
communication simulators are activated:
```json
"federates": {
    "cell": false,
    "omnetpp": false,
    "ns3": false,
    "sns": true
}
```
Our [tutorials](/tutorials) and [additional examples](/tutorials/additional_examples) demonstrate use cases for
communication usages and you should have a look at them if you are uncertain where to start. Furthermore we
recommend copying the configuration-files for the simulator you are going to use from the [Barnim scenario](/tutorials/barnim_basic). It
contains the most complete configurations and is well maintained.  
If you are an expert with one of the external network simulators ([ns3](/docs/simulators/network_simulator_ns3),
[OMNeT++](/docs/simulators/network_simulator_omnetpp)) the Barnim scenario will also give
you an overview on how to configure those.

## Other Simulators

Here we'll discuss two simulators integrated with Eclipse MOSAIC and their use-cases, namely the `Event Server` and the
`Battery Simulator`.

### Event server
The event server can be used to emit events to vehicles inside it's predefined borders. In the Barnim scenario
an event server is used to simulate an icy area, which is then noticed by the sensor of a weather server RSU.  
Every defined event requires a type, a defined geographical area (e.g. circular, rectangular), the strength and a time frame. Have a look
 at the [eventserver_config.json](files/eventserver_config.json) to see how this can be
configured. If you want to use the event server make sure to have it enabled in the `scenario_config.json`.

### Battery
The battery simulator is used to simulate electric vehicles. It offers a lot of customization, because you can
dynamically load your own battery, vehicle and environment models. Have a look a the [battery_config.json](files/battery_config.json), taken from the Barnim scenario.
The three models used are included with Eclipse MOSAIC and you can freely use them. 

## Output

There are various options to generate output results of your simulations (see the
[visualization chapter](/docs/visualization/filevis)). 

The first step is to create a file called `output_config.xml` in a new directory called `output`.
If you used the scenario-convert tool the file should be generated automatically. 

```plaintext
└─ steglitz
   ├─ application
   |  └─ steglitz.db
   ├─ mapping
   |  └─ mapping_config.json
   ├─ output
   |  └─ output_config.xml
   ├─ sumo
   |  ├─ steglitz.net.xml
   |  └─ steglitz.sumocfg
   └─ scenario_config.json .................. Basic configuration of the simulation scenario
```

Example configuration for output generation can be taken from the example scenarios from the tutorials section.

Next make sure the visualization federate is activated in the `scenario_config.json`.
<!--
```xml
<!-- Visualization -- >
<federate id="output" active="true"/>
```

Now we have to configure the statistics visualizer itself. This [visualizer_config.xml](/docs/building_scenarios/files/steglitz_visualizer_config.xml) contains the basic
configuration in order to calculate the average travel times for the vehicles. If you want to make adaptions, please
refer to [statistics visualizer](/docs/visualization/statistics).  
Go ahead and run the simulation one more time. Afterwards the log-directory should contain a file called 
`AverageVehicleTravelTime.csv` in a directory called `StatisticsVisualizer`:
```csv
group;group-value;total;
Car;186.369;336;
```
This tells us that there was a total amount of 336 vehicles of the type `Car` in the simulation, which traveled
for 186.369  seconds on average.
-->

__Conclusion__  
After this small, hands-on introduction to visualizers you should know where to configure them and after some additional
reading, you should be able to configure different types of visualizers for your use-cases.