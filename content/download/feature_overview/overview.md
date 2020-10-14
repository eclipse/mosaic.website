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
    width: 30%;
}
table th:nth-of-type(3) {
    width: 20%;
    text-align: center;
}
table th:nth-of-type(4) {
    width: 20%;
    text-align: center;
}
table th:nth-of-type(5) {
    width: 20%;
    text-align: center;
}
</style>

**Eclipse MOSAIC** is the free-to-use and open-source version of the **MOSAIC** simulation framework. This version
includes all simulators and tools we think are most valuable for research purposes. For more complex studies, we provide additional
features in our **MOSAIC Extended** version, which includes all open-source elements of Eclipse MOSAIC and additional tools for scenario
preparation and visualization. For commercial users we even provide additional simulators, such as the vehicle simulation **PHABMACS**.

|  | *Feature*                 | Eclipse MOSAIC| MOSAIC Extended |                 |
|:-|:--------------------------|:-------------:|:---------------:|:---------------:|
|  |**License Type**           | Open Source <br> EPL 2.0|Free for Research & Academical Use|Commercial|
|  |||||| 
|  |**[Runtime Infrastructure](/docs/extending_mosaic/)** |**yes**|**yes**| -     |
|  |**[Interactions Library](/docs/extending_mosaic/interactions/)**   |**yes**|**yes**| -     |
|  |**[Tutorials](/tutorials)**              |**yes**|**yes**| -     |
|*Simulators*||||| 
|  |[**Eclipse SUMO**](/docs/simulators/traffic_simulator_sumo/)           |**yes**|**yes**| -     |
|  |[**OMNeT++**](/docs/simulators/network_simulator_omnetpp/)                |**yes**|**yes**| -     |
|  |[**ns-3**](/docs/simulators/network_simulator_ns3/)                   |**yes**|**yes**| -     |
|  |[**Application Modelling**](/docs/simulators/application_simulator/)  |**yes**|**yes**| -     |
|  |[**Cellular Communication**](/docs/simulators/traffic_simulator_cell/) |**yes**|**yes**| -     |   
|  |**ITS-G5 Communication**   |**yes**|**yes**| -     |
|  |[**Environment**](/docs/simulators/environment_simulator/)            |**yes**|**yes**| -     |
|  |[**Battery / Charging**](/docs/simulators/battery_simulator/)     | -     |**yes**| -     |
|  |[**Variable Message Signs**](/docs/simulators/environment_simulator/#traffic-signs-simulator) | -     |**yes**| -     |
|  |**PHABMACS Scenario API**  |**yes**|**yes**| -     |
|  |**PHABMACS Vehicle Simulator**| -     | -     |**yes**|
|*Visualizer*||||| 
|  |**[Browser Visualization](/docs/visualization/)**  |**yes**|**yes**| -     |
|  |**[File Output](/docs/visualization/filevis/)**            |**yes**|**yes**| -     |
|  |**[Statistics Output](/docs/visualization/statistics/)**      | -     |**yes**| -     |
|  |**[3D Visualization](/docs/simulators/traffic_simulator_phabmacs/)**       | -     | -     |**yes**|
|  |**[ITEF](/docs/visualization/itef/)**                   | -     | -     |**yes**|
|*Tools* |||||| 
|  |**[Command Line Tool](/docs/run_simulations/)**      |**yes**|**yes**| -     |
|  |**Run Federates in Docker**|**yes**|**yes**| -     |
|  |**[Scenario Convert](/docs/building_scenarios/scenario_convert/)**       | -     |**yes**| -     |
|  |**[Simulation Set Runner](/docs/run_simulations/simulation_set/)**  | -     | -     |**yes**|
|  |**TrafficGen**             | -     | -     |**yes**|


