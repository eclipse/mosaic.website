+++
widget = "text_image"  # See https://sourcethemes.com/academic/docs/page-builder/
headless = true  # This file represents a page section.
active = true  # Activate this widget? true/false
weight = 20  # Order that this section will appear in.

title = "Versions and Features"
+++

<style>
table {
    width: 80%;
    margin: 1rem auto 3rem auto;
}
table th:first-of-type {
    width: 10%;
}
table th:nth-of-type(2) {
    width: 33%;
}
table th:nth-of-type(3) {
    width: 30%;
    text-align: center;
}
table th:nth-of-type(4) {
    width: 30%;
    text-align: center;
}
</style>

**Eclipse MOSAIC** is the free-to-use and open-source version of the **MOSAIC** simulation framework. This version
includes all simulators and tools we think are most valuable for research purposes. For more complex studies, we provide additional
features in our **MOSAIC Extended** version, which includes all open-source elements of Eclipse MOSAIC and additional tools for scenario
preparation and visualization. For commercial users we even provide additional simulators, such as the vehicle simulation **PHABMACS**.

|  | *Feature*                 | {{< img src="/img/EclipseMOSAIC-Logo-RGB-positiv.svg" width="220px" >}} | {{< img src="/img/MOSAICExtended-Logo-RGB-positiv.svg" width="220px" >}} |
|:-|:--------------------------|:-------------:|:---------------:|
|  |**License Type**           | Open Source <br> EPL 2.0|Commercial*|
|  |||||| 
|  |**{{< link href="/docs/extending_mosaic/" title="Runtime Infrastructure" >}}**                   |**✓**|**✓**|
|  | **{{< link title="Interactions Library" href="/docs/extending_mosaic/interactions/" >}}**        |**✓**|**✓**|
|  | **{{< link title="Tutorials" href="/tutorials" >}}**                                             |**✓**|**✓**|
|*Simulators*||||| 
|  | **{{< link title="Application Modelling" href="/docs/simulators/application_simulator/" >}}**    |**✓**|**✓**|
|  | **{{< link title="Eclipse SUMO" href="/docs/simulators/traffic_simulator_sumo/" >}}**            |**✓**|**✓**|
|  | **{{< link title="OMNeT++" href="/docs/simulators/network_simulator_omnetpp/" >}}**              |**✓**|**✓**|
|  | **{{< link title="ns-3" href="/docs/simulators/network_simulator_ns3/" >}}**                     |**✓**|**✓**|
|  | **{{< link title="Cellular Communication" href="/docs/simulators/traffic_simulator_cell/" >}}**  |**✓**|**✓**| 
|  |**ITS-G5 Communication**                                                |**✓**|**✓**|
|  | **{{< link title="Environment" href="/docs/simulators/environment_simulator/" >}}**              |**✓**|**✓**|
|  | **{{< link title="Battery / Charging" href="/docs/simulators/battery_simulator/" >}}**           | -   |**✓**|
|  | **{{< link title="Variable Message Signs" href="/docs/simulators/environment_simulator/#traffic-signs-simulator" >}}** | -     |**✓**|
|  |**PHABMACS Scenario API**                                               |**✓**|**✓**|
|  |**PHABMACS Vehicle Simulator**                                          | -   |**✓**|
|*Visualizers*||||| 
|  | **{{< link title="Browser Visualization" href="/docs/visualization/" >}}**                       |**✓**|**✓**|
|  | **{{< link title="File Output" href="/docs/visualization/filevis/" >}}**                         |**✓**|**✓**|
|  | **{{< link title="Statistics Output" href="/docs/visualization/statistics/" >}}**                | -   |**✓**|
|  | **{{< link title="3D Visualization" href="/docs/simulators/traffic_simulator_phabmacs/" >}}**    | -   |**✓**|
|  | **{{< link title="ITEF" href="/docs/visualization/itef/" >}}**                                   | -   |**✓**|
|*Tools* |||||| 
|  | **{{< link title="Command Line Tool" href="/docs/run_simulations/" >}}**                         |**✓**|**✓**|
|  |**Run Federates in Docker**                                             |**✓**|**✓**|
|  | **{{< link title="Scenario Convert" href="/docs/building_scenarios/scenario_convert/" >}}**      | -   |**✓**|
|  | **{{< link title="Simulation Set Runner" href="/docs/run_simulations/simulation_set/" >}}**      | -   |**✓**|
|  |**TrafficGen**                                                          | -   |**✓**|

*) For the commercial version of MOSAIC Extended please leave us a message at mosaic@fokus.fraunhofer.de and we will 
create an individual offer suitable to your needs.