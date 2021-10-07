---
title: Scenario Overview
linktitle: Scenario Overview
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 10
menu:
  docs:
    parent: scenarios
---

This section provides information on creating own simulation scenarios completely from scratch, using the tool [Scenario Convert](docs/scenarios/create_a_new_scenario).
Furthermore, the section explains how to run series of simulations for the same scenario, yet for different parametrizations, using the [Simulation Runner](docs/scenarios/run_simulation_series).

A scenario is generally a 
folder structure that reflects the different components usually found in a simulation. Each of the folders
contains various configuration files which in total describe the simulation setup, including 
the movements of the vehicles, the definition of the road network, communication properties, and the like. 

The following file structure shows the very minimum setup of a simulation scenario in Eclipse MOSAIC (a traffic simulator and the mapping for initial vehicle choreography):

```plaintext
└─ <scenarioName>
   ├─ application
   |  └─ <scenarioName>.db................ Scenario database file
   ├─ mapping
   |  └─ mapping_config.json ............. Mapping configuration file
   ├─ sumo*
   |  └─ <scenarioName>.net.xml .......... SUMO network file
   |  └─ <scenarioName>.sumocfg .......... SUMO configuration file
   └─ scenario_config.json ............... General configuration of the simulation scenario
```

*) Most tutorials are based on Eclipse SUMO. However, if a different traffic or vehicle simulator is coupled, the SUMO configuration is not certainly required, but the configuration for the other simulator.

In addition to those files, each simulator (e.g. Cell, ns-3, OMNeT++, Environment ...) needs to be provided with its custom configuration files. 

## Main Configuration

The main configuration file of a scenario is `scenario_config.json`. In this file general properties are configured, such as the name of the scenario, the random seed, and activated simulators. Such a file looks like the following:

```json
{
    "simulation": {
        "id": "Barnim",
        "duration": "1000s",
        "randomSeed": 268965854,
        "projection": {
            "centerCoordinates": {
                "latitude": 52.511289,
                "longitude": 13.3167457
            },
            "cartesianOffset": {
                "x": -385769.05,
                "y": -5819239.29
            }
        },
        "network": {
            "netMask": "255.255.0.0",
            "vehicleNet": "10.1.0.0",
            "rsuNet": "10.2.0.0",
            "tlNet": "10.3.0.0",
            "csNet": "10.4.0.0",
            "serverNet": "10.5.0.0",
            "tmcNet": "10.6.0.0"
        }
    },
    "federates": {
        "application": true,
        "cell": false,
        "environment": true,
        "sns": true,
        "ns3": false,
        "omnetpp": false,
        "output": true,
        "sumo": true
    }
}
```

The following fields needs to be configured:
* **`id`** - The name of the scenario
* **`duration`** - The duration of the simulation in seconds.
* **`randomSeed`** - The seed to initialize the random number generator with in order to have deterministic results. If not set, a random seed is taken. 
* **`projection`** - Configures the coordinate transformation from geographic coordinates to cartesian coordinates. Having a correct setting 
here is crucial to get correct results that map to real world coordinates so the simulation results can be visualized in some way. 
The center coordinate will be used to determine the correct UTM zone, the `cartesianOffset` can be determined by having a look at the trafﬁc simulators network ﬁle, 
e.g. SUMOs `*.net.xml` contains this information in the `netOffset` attribute of the location tag. 
* **`network`** - Within this config the address resolution scheme is speciﬁed. The subnets for all unit types are described here.
  Usually, default configuration should be sufficient. However, if you have many vehicles in your scenario the IP address
  space would be to small to provide enough addresses. In such cases, the `netMask` and all `subnets` have to be configured accordingly. 
* Last but not least, the **`federate`** tags define which simulators are active in the simulation. 

## Traffic Simulator Configuration

The generated files for the used traffic simulator are placed into the folder named after that simulator, e. g. `sumo` . 
For example, the `<scenarioName>.sumocfg` describes the main configuration of the SUMO simulator, which should refer to a network file and a route file:

```xml
<configuration>
    <input>
        <net-file value="MyScenario.net.xml" />
        <route-files value="MyScenario.rou.xml" />
    </input>
</configuration>
```

While the `*.net.xml` is a mandatory file to be placed within the `sumo` directory, the `*.rou.xml` is automatically generated
by the SumoAmbassador when the simulation is started.

More information about the configuration of SUMO can be found in Section [Eclipse SUMO Overview](docs/simulators/traffic_simulator_sumo#configuration).

## Applications and Mapping

{{% alert tip %}}
Read the detailed documentation of the [Mapping Configuration](/docs/mosaic_configuration/mapping_ambassador_config).  
{{% /alert %}}

### Vehicles

Usually you want the simulated vehicles to be equipped with some kind of applications that influence the
vehicle's behavior. To do that you copy the jar files of your applications to the folder `<scenarioName>/application` . 
Having the applications in place you will have to create a `mapping_config.json` file in the folder `<scenarioName>/mapping` . 

The following file would spawn 1 vehicle every five seconds (720 veh/hour divided by 3600 sec) until it reaches the max number of vehicles: 500. All the vehicles would be equipped with an application sending CA-messages periodically. 

```json
{
    "prototypes":[
        {
            "name": "Car",
            "accel": 2.6,
            "decel": 4.5,
            "maxSpeed": 80.0,
            "applications": [
                "org.eclipse.mosaic.fed.application.app.etsi.VehicleCamSendingApp"
            ]
        }
    ],
    "vehicles":[
        {
            "startingTime": 0.0,
            "targetFlow": 720,
            "maxNumberVehicles": 500,
            "route": "3",
            "types": [ { "name": "Car" } ]
        }
    ]
}
```

### Traffic lights

If you want to simulate traffic lights equipped with applications, traffic lights should be defined in the simulator specific configuration file and also added to the mapping configuration file. The applications can be equipped by explicitly specifying them as "applications" 

```json
{
    "trafficLights": [
        {
            "tlGroupId": "Bismarkstr_Krummestr",
            "applications": [
                "org.eclipse.mosaic.app.tutorial.TrafficLightApp"
            ]
        }
    ]
}
```

or by referring to previously defined prototypes:

```json
{
    "prototypes":[
        {
            "name": "Car",
            "accel": 2.6,
            "decel": 4.5,
            "maxSpeed": 80.0,
            "applications": [
                "org.eclipse.mosaic.fed.application.app.etsi.VehicleCamSendingApp"
            ]
        },
        {
            "name": "TrafficLight",
            "applications": [
                "org.eclipse.mosaic.app.tutorial.TrafficLightApp"
            ]
        }
    ],
    "vehicles":[
        {
            "startingTime": 0.0,
            "targetFlow": 720,
            "maxNumberVehicles": 500,
            "route": "3",
            "types": [ { "name": "Car" } ]
        }
    ],
    "trafficLights": [
        {
            "tlGroupId": "Bismarkstr_Krummestr",
            "name": "TrafficLight"
        }
    ]
}
```

Please note that traffic light name and traffic light itself in the mapping file stand for a traffic light group controlling a whole junction. Traffic light group can consist of many individual traffic lights controlling an exact lane. The value of the "tlGroupId" key MUST coincide with the name of the traffic light group in the traffic simulator related configuration file (with tlLogic id for SUMO and with junction id for PHABMACS). 

For SUMO, the description of traffic light groups and their programs can be found in `<scenarioname>.net.xml`:

```xml
<tlLogic id="26704448" type="static" programID="1" offset="0">
    <phase duration="39" state="GGrG"/>
    <phase duration="6" state="yyry"/>
    <phase duration="39" state="rrGG"/>
    <phase duration="6" state="rryy"/>
</tlLogic>
```

Corresponding `mapping_config.json`:

```json
{
    ...
    "trafficLights": [
        {
            "tlGroupId": "26704448",
            "name": "TrafficLight"
        }
    ]
}
```

For more information about how SUMO traffic lights work, please refer to [SUMO Traffic Lights](https://sumo.dlr.de/docs/Simulation/Traffic_Lights.html). 

<!--
For Phabmacs, one should create a separate configuration file containing the description of traffic light groups and traffic light programs. 

mapping_config.json:

```json
{
    ...
    "trafficLights": [
        {
            "tlGroupId": "Bismarkstr_Krummestr",
            "name": "TrafficLight"
        }
    ]
}
```

phabmacs_config.json:

```json
{
    ...
    "ttlFile":"berlinTrafficLights.ttl.json",
    ...
}
```

An example of how the traffic light configuration can look like in berlinTrafficLights.ttl.json:

```json
{
    "programs": [
        {
            "id": "default",
            "phases": [
                {
                    "id": "0",
                    "duration": 10,
                    "groupStates": [
                        "green", "red", "green", "red"
                    ]
                }, 
                {
                    "id": "1",
                    "duration": 15,
                    "groupStates": [
                        "red", "green", "red", "green" 
                    ]
                }
            ],
            "transitions": [
                {
                    "from": "0",
                    "to": "1",
                    "yellowPhaseDuration": 3,
                    "allRedPhaseDuration": 3,
                    "redYellowPhaseDuration": 1
                },
                {
                    "from": "1",
                    "to": "0",
                    "yellowPhaseDuration": 3,
                    "allRedPhaseDuration": 6,
                    "redYellowPhaseDuration": 1
                }
            ]
        }
        
    ],
    "junctions": [
        {
            "id": "Bismarkstr_Krummestr",
            "signalGroups": [
                {
                    "id": "K1",
                    "tlLocation":{
                        "latitude": 52.51187173469569,
                        "longitude": 13.309426296977083
                    }
        
                },
                {
                    "id": "K2",
                    "tlLocation":{
                        "latitude": 52.511666041314484,
                        "longitude": 13.3092408198885
                    }
                },
                {
                    "id": "K3",
                    "tlLocation":{
                        "latitude": 52.51155112036543,
                        "longitude": 13.30933672655086
                    }
                },
                {
                    "id": "K4",
                    "tlLocation":{
                        "latitude": 52.51200251720905, 
                        "longitude": 13.30936414260184, 
                        "heading": 180.0
                    },
                    "lanes": [ 0 ]
                }
            ],
            "availablePrograms": [
                "default"
            ]
        }
    ]
}
```
-->

The `application` folder furthermore needs a generated database file `<scenarioName>.db` . This database file
contains information about the road network (road topology) and all routes the vehicles can drive on. This file
is usually generated by the tool `scenario-convert`, which is described [here](docs/scenarios/create_a_new_scenario) in detail.

## Communication Simulator

The configuration of the communication parameters are usually not dependent from the location of the road network. Therefore,
most of the required files can be extracted from other scenarios, such [Barnim](tutorials/barnim_basic) or
[Tiergarten](tutorials/tiergarten). 
Depending on the simulator you will need to configure the geographic extend of the simulation
area. You can ﬁnd that data in the trafﬁc simulators network file, e.g. SUMOs `*.net.xml` contains this
information in the `convBoundary` attribute of the location tag.
* For **OMNeT++**, it concerns the values of `constraintArea` in the `omnetpp.ini`
* For the **Eclipse MOSAIC Cell** simulator, the expansions do not need to be conﬁgured directly. However, the areas
of the conﬁgured regions (in `regions.json`) have to be in line with the scenario location.
* The **SNS** also comes without an additional expansion deﬁnition.

Further information on the communication simulators can be found in:
- [Eclipse MOSAIC Cell](docs/simulators/network_simulator_cell)
- [Eclipse MOSAIC SNS](docs/simulators/network_simulator_sns)
- [OMNeT++](docs/simulators/network_simulator_omnetpp)
- [ns-3](docs/simulators/network_simulator_ns3)
