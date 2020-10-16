+++
widget = "text_image"  # See https://sourcethemes.com/academic/docs/page-builder/
headless = true  # This file represents a page section.
active = true  # Activate this widget? true/false
weight = 20  # Order that this section will appear in.

title = "Versions and Features"
+++

<style>
table th:first-of-type {
    width: 10%;
}
table th:nth-of-type(2) {
    width: 40%;
}
table th:nth-of-type(3) {
    width: 25%;
    text-align: center;
}
table th:nth-of-type(4) {
    width: 25%;
    text-align: center;
}
</style>

**Eclipse MOSAIC** is the free-to-use and open-source version of the **MOSAIC** simulation framework. This version
includes all simulators and tools we think are most valuable for research purposes. For more complex studies, we provide additional
features in our **MOSAIC Extended** version, which includes all open-source elements of Eclipse MOSAIC and additional tools for scenario
preparation and visualization. For commercial users we even provide additional simulators, such as the vehicle simulation **PHABMACS**.

|  | *Feature*                 | Eclipse MOSAIC| MOSAIC Extended |
|:-|:--------------------------|:-------------:|:---------------:|
|  |**License Type**           | Open Source <br> EPL 2.0|Commercial*|
|  |||||| 
|  |[**Runtime Infrastructure**](/docs/extending_mosaic/)                   |**✓**|**✓**|
|  |[**Interactions Library**](/docs/extending_mosaic/interactions/)        |**✓**|**✓**|
|  |[**Tutorials**](/tutorials)                                             |**✓**|**✓**|
|*Simulators*||||| 
|  |[**Application Modelling**](/docs/simulators/application_simulator/)    |**✓**|**✓**|
|  |[**Eclipse SUMO**](/docs/simulators/traffic_simulator_sumo/)            |**✓**|**✓**|
|  |[**OMNeT++**](/docs/simulators/network_simulator_omnetpp/)              |**✓**|**✓**|
|  |[**ns-3**](/docs/simulators/network_simulator_ns3/)                     |**✓**|**✓**|
|  |[**Cellular Communication**](/docs/simulators/traffic_simulator_cell/)  |**✓**|**✓**| 
|  |**ITS-G5 Communication**                                                |**✓**|**✓**|
|  |[**Environment**](/docs/simulators/environment_simulator/)              |**✓**|**✓**|
|  |[**Battery / Charging**](/docs/simulators/battery_simulator/)           | -   |**✓**|
|  |[**Variable Message Signs**](/docs/simulators/environment_simulator/#traffic-signs-simulator) | -     |**✓**|
|  |**PHABMACS Scenario API**                                               |**✓**|**✓**|
|  |**PHABMACS Vehicle Simulator**                                          | -   |**✓**|
|*Visualizer*||||| 
|  |[**Browser Visualization**](/docs/visualization/)                       |**✓**|**✓**|
|  |[**File Output**](/docs/visualization/filevis/)                         |**✓**|**✓**|
|  |[**Statistics Output**](/docs/visualization/statistics/)                | -   |**✓**|
|  |[**3D Visualization**](/docs/simulators/traffic_simulator_phabmacs/)    | -   |**✓**|
|  |[**ITEF**](/docs/visualization/itef/)                                   | -   |**✓**|
|*Tools* |||||| 
|  |[**Command Line Tool**](/docs/run_simulations/)                         |**✓**|**✓**|
|  |**Run Federates in Docker**                                             |**✓**|**✓**|
|  |[**Scenario Convert**](/docs/building_scenarios/scenario_convert/)      | -   |**✓**|
|  |[**Simulation Set Runner**](/docs/run_simulations/simulation_set/)      | -   |**✓**|
|  |**TrafficGen**                                                          | -   |**✓**|

*) For the commercial version of MOSAIC Extended please leave us a message at mosaic@fokus.fraunhofer.de and we will 
create an individual offer suitable to your needs.