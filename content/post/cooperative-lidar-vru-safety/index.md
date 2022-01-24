---
title: Evaluating Cooperative LiDAR Data Fusion for VRU Safety with MOSAIC Extended
categories:
  - Simulation
  - PHABMACS
summary: People traveling by bike, on foot or e-scooters are little protected in the event of a collision and therefore known as Vulnerable Road Users (VRUs). Modern sensor systems for automated driving such as LiDAR are able to detect VRUs, thus facilitate warnings and safety. Yet, in certain situations, local blind spots could occur. Data fusion from different vehicles could solve this issue - as it is shown in a simulation study using PHABMACS and MOSAIC Extended.
tags: []
date: "2022-01-24T00:00:00Z"
lastMod: "2022-01-24T00:00:00Z"
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
image:
  placement: 2
  caption: ""
  focal_point: ""
  preview_only: true

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references 
#   `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---

**People traveling by bike, on foot or e-scooters are little protected in the event of a collision and therefore known as Vulnerable Road Users (VRUs). Modern sensor systems for automated driving such as LiDAR are able to detect VRUs, thus facilitate warnings and safety. Yet, in certain situations, local blind spots could occur. Data fusion from different vehicles could solve this issue - as it is shown with PHABMACS and MOSAIC Extended.**

{{< figure src="featured.png" numbered="false" width="70%" >}}

During the research project **[RealLabor Hamburg](https://reallab-hamburg.de/projekte/vernetzte-vulnerable-road-users/)**, we used MOSAIC to create a complex traffic situation for investigating the general benefit of LiDAR based object detection and the effectiveness of merging the LiDAR sensor data (point clouds) from multiple vehicles before applying object detection. In this case, the LiDAR data would not be processed locally on the vehicles but communicated to a server (possibly in the Mobile Edge Cloud) and processed there - accordingly it results in a Cooperative LiDAR Data Fusion.

## Scenario for Data Collection

As a first step, we set up a simulation scenario at the Sievekingplatz in Hamburg. 
At the chosen road section, complicated traffic situations can arise due to the multi-lane road, the parallel bike lane, and the bus stop. 
To simulate such a situation, we added a halting bus, a bike riding along the bike lane, and three passenger cars driving in a row. 
With the **[Mapping](docs/simulators/application_mapping)** configuration file, the vehicles are timed such that the second vehicle in the row can not perceive the bike when passing the bus, even in the safety-relevant close range.

{{< figure src="scenario_screenshot.png" title="Frame of the Sievekingplatz scenario. The trajectories of the vehicles are marked in yellow." numbered="true" width="80%" >}}

The simulation of LiDAR sensors is implemented in the **PHABMACS** vehicle simulator, which is integrated in **MOSAIC Extended**. 
With the `phabmacs_config.json` file it is possible to configure LiDAR sensors according to real products. In this case we configured it according to the Velodyne HDL-64E. 

In the **[Application Simulator](docs/simulators/application_simulator)**, each of the passenger cars is equipped with a LiDAR sensor which scans the environment and creates a 3D point cloud at a rate of 10 Hz.
To pool the LiDAR data from the passenger vehicles together at a server, we mapped a `LidarTransmissionApp` on each vehicle, forwarding the LiDAR point cloud to the server, using the `PointCloudMessages`.
Additionally, all simulated vehicles (cars, bus and bike) are mapped with a `ReportingApp`, using the `ReportMessages` to report vehicle information such as e.g., position and heading. These data are the ground truth for original location information, used in the later accuracy comparison.
On the server, a `DataManagementApp` handles all received messages for the cooperative data fusion and exports data to log files, using the **[Output Generator](docs/visualization/filevis)**.
The **[Cell Simulator](docs/simulators/network_simulator_cell)** models the message transmission between the mobile entities and the server. An overview of all components can be seen below.

{{< figure src="scenario_overview.png" title="Scenario components overview" numbered="true" width="80%" >}}

## Evaluation of LiDAR Data Processing 

Based on the data collected from the simulation, we evaluated the effectiveness of merging sensor data before object detection. 
We specifically focused on the detectability of the bike based on the point cloud data. 
For this purpose, we estimated object detection results by filtering the LiDAR hits on the bike, using locational vehicle data gained from the `ReportMessages`.

In FIGURE 3, the number of LiDAR hits on the bike at each sampling step are displayed. 
As there are always some LiDAR hits, we can conclude that at all times the bike is visible from at least one perspective. 
Though at certain frames some passenger cars could not perceive the bike, as it was occluded by the bus from their perspective.
Especially when `car_2` is passing the bike, there are some frames (~16.8-17.8s) at which the general visibility of the bike is very limited. 
In these frames an object detection could profit a lot from merging the individual point clouds, as it would increase the overall amount of LiDAR hits and therefore the detection of an object could be more likely.
 
{{< figure src="LidarHits.png" title="The total amount of LiDAR hits on the car from each LiDAR and the sum of all LiDAR hits." numbered="true" width="46%" show="hold" >}} 

To further evaluate the merging of point clouds we compared it with the merging of objects. 
For the *PointCloudMerge*, the latest point cloud from all vehicles with a LiDAR sensor are unified, resulting in one large global point cloud. This point cloud is then used to derive a bounding box for the bike. 
For the *ObjectMerge* a bounding box for each individual point cloud is derived. From all these bounding boxes, the one which is dimensionally most similar to the actual bounding box of the bike, is selected as final result. 
To compare the results of both processing methods the *Bounding Box RMSE* was used as a metric. 
This metric represents the relation between the bounding box calculated from the point clouds and the actual bounding box of the bike, considering width and length of the bounding boxes. 
A value of `0.0` corresponds to no error and therefore a perfect match of the bounding boxes.

In FIGURE 4 the results of both merging methods can be seen. 
The results show that the bounding boxes are more accurate in many time steps when applying the *PointCloudMerge* method. 
Also, some peaks in the metric observable with the *ObjectMerge* method could be averted.
The often more accurate bounding boxes with *PointCloudMerge* could lead to an overall more stable object detection and more accurate labeling, which is important to correctly estimate behavior of objects in an autonomous driving context.

{{< figure src="PointCloudMerge_vs_ObjectMerge.png" title=": Comparison of different data merging methods with the *BoundingBox RMSE* metric." numbered="true" width="46%" show="hold" >}} 
 
## Conclusion
We created a complex traffic situation collecting LiDAR sensor data for the preliminary evaluation of a system for merging 3D point clouds before applying object detection.

MOSAICs **Multi-Domain** aspect was utilized as the evaluated system including moving vehicles, a bus and a bike, dedicated applications for reporting and data processing, as well as the communication link for data transmission was modelled with the simulators PHABMACS, Application Simulator and Cell Simulator. Especially PHABMACS can model high-resolution LiDAR sensors and precise driving maneuvers - just according to MOSAICs **Multi-Scale** aspect. On top, the Output Generator supported with formatted data recording for post-processing of simulation results.

The results show that merging point clouds is indeed a processing method for LiDAR data worth to investigate further, as it could increase the likelihood of detecting an object and increase the accuracy of the labeling. 

---

Further information about RealLabHH and the use case of protecting VRUs: https://reallab-hamburg.de/projekte/vernetzte-vulnerable-road-users/

RealLabHH was completed in December 2021 after 1.5 years. It was funded by the German Federal Ministry of Transport and Digital Infrastructure (BMVI).
