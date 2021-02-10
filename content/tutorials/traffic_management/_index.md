---
title: Traffic Management
linktitle: traffic_management 
toc: false
type: tutorials
date: "2019-05-05T00:00:00+01:00"
draft: false
---

{{% alert note %}}
All files you need for this tutorial are included in the Eclipse MOSAIC zip file:  
**{{< link title="Download Eclipse MOSAIC" href="/download" >}}**
{{% /alert %}}

Next to vehicles, road side units, and traffic lights, Eclipse MOSAIC provides also a simulation unit for traffic management, called TrafficManagement Center (TMC). 
With a TMC, road infrastructure can be integrated and controlled. For example, detectors placed along the road can be used to measure traffic properties, such as traffic flow or traffic density. 
Furthermore, those measures can be used to open and close lanes, or to adjust the speed limits of roads. 

This tutorial provides information about TMC applications and how they can interact with the traffic simulator SUMO.

{{% alert learning_objectives %}}
The Traffic Management tutorial focuses on the road infrastructure, and it gives you an opportunity to collect required data (e.g. traffic density) of the simulation scenario.
In conclusion, the main aims of this tutorial are:

* Definition and Configuration the detectors as provided in `Highway.add.xml`.
* Referencing the so-called 'additional file' like in `Highway.sumo.cfg`.
* Understand the difference between `Lane Area Detectors` and `Induction Loop Detectors`.
* Configuration and Mapping of TMC applications in [`mapping_congig.json`](#configuration-of-traffic-management-centers).
* Implement of {{< link title="TMC applications" href="#traffic-management-center-applications" >}}.
{{% /alert %}}

## Scenario Overview
The following image gives an overview about the scenario Highway, provided in the Eclipse MOSAIC scenario directory.

{{< figure src="images/highway-overview.png" title="Highway overview" numbered="true" >}}

* Vehicles drive on the highway from east to west (blue line)
* At one location (red rectangle), induction loop detectors measure traffic properties, (e.g. traffic flow).
* In the area of the orange rectangle, two lanes are closed from simulation time **10s** until **200s**, resulting in a temporary traffic jam.

## Detector configuration
In order to measure traffic properties, such as traffic flow, or traffic density, detectors have to placed in the scenario. This is achieved by setting up induction loop detectors or lane area detectors in the SUMO scenario.

In the `*.sumo.cfg` file of the scenario, a so-called "additional file" has to be referenced:

```xml 
<configuration>
	<input>
		<net-file value="highway.net.xml" />
		<route-files value="highway.rou.xml" />
		<additional-files value="highway.add.xml" />
	</input>
	...
</configuration>
```

This additional file highway.add.xml now defines the induction loop detectors which should be placed
within the road network:

```xml
<additionals>
	<e1Detector id="detector_0" lane="319292433_3257049721_1288275815_3257049721_0" pos="700" freq="100.00" file="detectors.txt" />
	<e1Detector id="detector_1" lane="319292433_3257049721_1288275815_3257049721_1" pos="700" freq="100.00" file="detectors.txt" />
	<e1Detector id="detector_2" lane="319292433_3257049721_1288275815_3257049721_2" pos="700" freq="100.00" file="detectors.txt" />
</additionals>
```

Currently, Eclipse MOSAIC supports `e1Detector` and `laneAreaDetector`. To get more detailed information on this topic, please consider the SUMO user documentation.

## Configuration of Traffic Management Centers

{{% alert tip %}}
Read the detailed documentation of the {{< link title="Mapping Configuration" href="/docs/mosaic_configuration/mapping_ambassador_config/" >}}.  
{{% /alert %}}

In the mapping_config.json of the scenario, a traffic management center can be equipped with an application. Each traffic management center is therefore connected with one ore more detectors and retrieves updates from those detectors during simulation. A valid configuration of a TMC looks as following:

```json
"tmcs": [
	{
		"name": "HighwayManagement",
		"applications": [ 
			"com.dcaiti.vsimrti.app.tutorials.highway.HighwayManagementApp('3', 2)" 
		],
		"inductionLoops": [ 
			"detector_0", "detector_1", "detector_2" 
		],
		"laneAreaDetectors": []
	}
],
"vehicles": [...]
```

Each TMC retrieves a name (e.g. for logging purposes). Secondly, a list of applications can be mapped onto the TMC. Those applications have to implement a specific interface (see next section).Furthermore, a list of induction loops is given, whose values the TMC applications will retrieve during the simulation.
The ids given heremust refer to e1Detectors of the SUMO scenario. The same applies for the list of lane area detectors, provided by the list laneAreas.

## Traffic Management Center Applications

The implementation of a TMC application follows the same scheme as every other application. The following class declaration is used for this purpose:

```java 
public class MyTmcApplication extends AbstractApplication<TrafficManagementCenterOperatingSystem> implements TrafficManagementCenterApplication {

	@Override
	public void afterUpdateLaneDetectors() {
		// is called whenever a lane detector (induction loop) has new values
	}

	@Override
	public void afterUpdateLaneSegments() {
		// is called whenever a lane segment (lane area detector) has new values		
	}	
}
```
In order to access values from lane detectors (= e1Detector), the following methods can be used:

```java
LaneDetector detector = getOs().getLaneSegment("detector_0");
double avgSpeed = detector.getAverageSpeedMs();
double flow = detector.getTrafficFlow(); // in veh/h aggregated over the last 1500 updates
```
Values from lane segments (= laneAreaDetector) can be accessed as follows:

```java
LaneSegment detector = getOs().getLaneSegment("lane_segment_0");
double avgSpeed = detector.getMeanSpeed(); // in m/s
double density = detector.getTrafficDensity(); // in veh/km
int vehiclesInSegment = detector.countVehiclesOnSegment();
```
Properties of lanes (e.g. allowed vehicle classes) can be changed as well:

```java
// close lane completely
getOs().changeLaneState(edgeId, laneIndex).closeForAll();
// open lane completely
getOs().changeLaneState(edgeId, laneIndex).openForAll();
// close lane for trucks only :
getOs().changeLaneState(edgeId, laneIndex).closeOnlyForVehicleClasses(
    VehicleClass.HeavyGoodsVehicle
);
// change maximum speed of lane (in m/s)
getOs().changeLaneState(edgeId, laneIndex).setMaxSpeed(10);
```