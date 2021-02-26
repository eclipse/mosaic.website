# Create your first Eclipse MOSAIC scenario

{{< button-download "Download Berlin Steglitz Map" "/docs/building_scenarios/files/steglitz.osm" >}}

This tutorial aims to familiarize you with Eclipse MOSAIC tools, with which you can easily create V2X simulation scenarios. With our step-by-step guide you will understand how Eclipse MOSAIC works and you will be able to convert data from external sources like [OpenStreetMap](https://www.openstreetmap.org) into the Eclipse MOSAIC specific database format with `scenario-convert`, which can be found in `mosaic/bin/tools`. 

## Learning Objectives 

* Using OSM data to create road network.
* Convert OSM data into the Eclipse MOSAIC specific database format.
* Create a number of SUMO specific network files(nodes, edges, connections)
* Generate routes with `scenario-convert`.
* Export traffic lights from OSM files.

## Overview

This tutorial intends to highlight the most common workflows for the work with `scenario-convert`. We will use the extracted map data of <a href="/docs/building_scenarios/files/steglitz.osm" download>Berlin Steglitz</a> in [OSM XML format](https://wiki.openstreetmap.org/wiki/OSM_file_formats) for most of the use cases. However, you can also use any region of your choice for the following steps in this tutorial. For a complete reference of the script please check [here](/docs/building_scenarios/scenario_convert#reference-documentation-for-scenario-convert).

{{% alert note %}}if you are not familiar how to export map data, please study {{< target-blank "Getting OSM Data" "https://wiki.openstreetmap.org/wiki/Export" >}}. You can download simply the *.osm file of the desired region using the {{< target-blank "openstreetmap.org" "https://www.openstreetmap.org/" >}} 
website or any other tool that supports *.osm file export (e.g.  {{< target-blank "JOSM" "https://josm.openstreetmap.de/" >}} or {{< target-blank "Merkaartor" "http://merkaartor.be/" >}}) and save it. {{% /alert %}}
{{< figure src="images/osm_uncleaned.png" title="OSM-File of Steglitz" numbered="true" >}}

## Creating a complete Eclipse MOSAIC-scenario from an OSM-file with one command

This is the most straight forward way to create a scenario from your OSM-file.
We will use the option `--osm2mosaic`, which is a combination of the options `--osm2db`
and `--db2mosaic`.  
Let's start off by showing you how a complete call could look like:

```bash
java -jar scenario-convert.jar --osm2mosaic -i steglitz.osm
```

{{% alert note %}}
Change `mosaic.version` to the current version you are using.  
In this section we use the scenario name `steglitz.*` as synonym for `path/to/steglitz.*`.
{{% /alert %}}

This achieves a couple of things. First off the script is going to create a SQLite-database,
which is used by Eclipse MOSAIC. Furthermore, a directory will be created, which should look like this:

```plaintext
└─ <working-directory>
   ├─ steglitz.osm
   ├─ application
   |  └─ steglitz.db
   ├─ cell
   |  ├─ cell_config.json
   |  ├─ network.json
   |  └─ regions.json
   ├─ environment
   |  └─ environment_config.json
   ├─ mapping
   |  └─ mapping_config.json
   ├─ ns3
   |  ├─ ns3_config.json
   |  └─ ns3_federate_config.xml
   ├─ omnetpp
   |  ├─ omnetpp_config.json
   |  └─ omnetpp.ini      
   ├─ output
   |  └─ output_config.xml
   ├─ sns
   |  └─ sns_config.json
   ├─ sumo
   |  ├─ steglitz.net.xml
   |  └─ steglitz.sumocfg
   └─ scenario_config.json .................. Basic configuration of the simulation scenario
```

Let's walk through all these files:
1. First the `steglitz.db` will be created using the `steglitz.osm`-file.
2. The `steglitz.db` will be used to create `steglitz.con.xml`, `steglitz.edg.xml` and `steglitz.nod.xml`, which are files used by SUMO.
3. [SUMO Netconvert](https://sumo.dlr.de/wiki/NETCONVERT) is used to create `steglitz.net.xml`, which is a [network representation](https://sumo.dlr.de/wiki/Networks/SUMO_Road_Networks) in SUMO.
4. Now the SUMO-configuration `steglitz.sumo.cfg` is written.
5. Afterwards the `mapping_config.json` and `mosaic_config.xml` are created and all files are moved to the right place.
In the `mosaic_config.xml` values like the center coordinate will automatically be set using data from the SUMO related files.

__Clean the OSM-file using Osmosis__  
Using the option `-o` / `--execute-osmosis` will create a new OSM-file with the suffix `_cleaned`. The created
file will contain much less clutter and usually is better suited for simulation purposes.
Check the images below to see the difference the clean-up process can make.
```bash
java -jar scenario-convert.jar --osm2mosaic -i steglitz.osm -o
```
{{< figure src="images/osm_cleaned.png" title="Cleaned OSM-file" numbered="true" >}}

{{< figure src="images/netfile_cleaned.png" title="Cleaned Net-file" numbered="true" >}}


__Generating Routes__  
The `scenario-convert` also offers the option `--generate-routes`, which will generate a route-file, given some additional information. In this tutorial we generate three routes, instantiated with `--number-of-routes`, between two nodes. The node-id's can be found in the `steglitz.nod.xml` file. 

```bash
java -jar scenario-convert.jar --osm2mosaic -i steglitz.osm -o --generate-routes
--route-begin-node-id 267350668 --route-end-node-id 313139970 --number-of-routes 3
```

Alternatively you can use the following command in order to generate routes between two geo-coordinates (latitude,longitude) with `--route-begin-latlon` and `--route-end-latlon` which can be determined from the `Node` table contained in the `steglitz.db` database by using the upper node-id`s:

```bash
java -jar scenario-convert.jar --osm2mosaic -i steglitz.osm -o --generate-routes
--route-begin-latlon 52.4551693,13.3193474 --route-end-latlon 52.4643101,13.3206834 --number-of-routes 3
```



see for all [command line options](/docs/building_scenarios/scenario_convert#reference-documentation-for-scenario-convert).

__Exporting Traffic Lights__  
Another feature of the scenario-convert script is the ability to export traffic lights from the osm-file to
be used by SUMOs netconvert. The extended call would look like this:
```bash
java -jar scenario-convert.jar --osm2mosaic -i steglitz.osm -o --generate-routes
--route-begin-latlon 52.4551693,13.3193474 --route-end-latlon 52.4643101,13.3206834 --number-of-routes 3
```

__Conlusion__  
This wraps up one of the main workflows with the scenario-convert-script.
A quick reminder on what we achieved:
- Cleaned up an OSM-file to only contain relevant data.
- Converted that OSM-file to formats that Eclipse MOSAIC/SUMO can handle.
- Created the project structure for a scenario.
- Calculated routes between two coordinates.

With all of this you can now start further developing your scenario. For a more detailed description on the next steps
please have a look [here (Simulation Scenarios)](/docs/building_scenarios) and 
[here (Application Development)](/docs/develop_applications).  
While this is the 'happy world' workflow it is often necessary to manually adapt routes and
insert them into your scenario. The following workflow
will explain how that is done and you will also get a more detailed overview of the scenario-convert-functions.

