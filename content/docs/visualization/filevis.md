---
title: File Visualizer
linktitle: File Visualizer
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  docs:
    parent: visualization
    weight: 2
---

The File Visualizer is a tool which gives you the opportunity to log specific Eclipse MOSAIC interaction types. For
each interaction the File Visualizer receives, one line (or more in case of an iteration object) is added 
to a CSV output file. This allows to track the movements of vehicles or to monitor the V2X message exchange.

One example output could be the following:

```csv
CELL_CONFIGURATION;6000000000;veh_0;true;7200000000;1400000000
V2X_MESSAGE_TRANSMISSION;6000000000;DENM;3;rsu_0;52.65027;13.545;0.0;CELL_GEOCAST;/255.255.255.255;null
VEHICLE_UPDATES;7000000000;veh_0;35.501624617716296;186.33236029307432;52.655993308955196;13.569065826100868;0.0;35.501624617716296;-0.6083753822837039;0.0;false;1;4067968_28830219_3290027832_2450938914;0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;false;false;false
VEHICLE_REGISTRATION;7000000000;veh_1;ElectricVehicle;null;Unequipped;5.0;2.5;70.0;2.6;4.5;0.5;1.0;1.0;0.0;1;1;0.0
VEHICLE_UPDATES;8000000000;veh_0;34.978651295430026;186.33236029306624;52.65568017869267;13.569019012494635;0.0;70.48027591314633;-0.5229733222862691;0.0;false;1;4067968_28830219_3290027832_2450938914;0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;false;false;false
V2X_MESSAGE_TRANSMISSION;8000000000;DENM;4;rsu_0;52.65027;13.545;0.0;CELL_GEOCAST;/255.255.255.255;null
VEHICLE_UPDATES;9000000000;veh_0;35.73455352933612;186.33236029306624;52.65536028153272;13.56897118787549;0.0;106.21482944248245;0.7559022339060917;0.0;false;1;4067968_28830219_3290027832_2450938914;0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;false;false;false
VEHICLE_UPDATES;9000000000;veh_1;35.52345835176762;186.33265000325784;52.65599046030636;13.569112899208802;0.0;35.52345835176762;-0.5865416482323766;0.0;false;1;4067968_28830219_3290027832_2450938914;1;0.0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;0.0;false;false;false
```

## Configuring the File Visualizer

* The main configuration file is located at `<mosaic-root>/scenarios/<scenarioName>/visualizer/visualizer_config.xml`

#### Basic configuration

The following listing shows a basic example for the configuration of the file visualizer:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<visualizer id="fileVisualizer" enabled="true" update="5" loader="com.dcaiti.vsimrti.fed.visualizer.FileVisualizerConfig">
	<filename>visualizer.csv</filename>
	<directory>.</directory>
	<separator>;</separator>
	<subscriptions>
		<subscription id="...">
		...
		</subscription>
		...
	</subscriptions>>
</visualizer>
```
_Basic configuration parameters for file visualizer_

The usage of the parameters is described in the following table:

| Parameter | Usage                                                                                                              |
| ---       | ---                                                                                                                |
| `id`      | Sets the id for the visualizer                                                                                     |
| `enabled` | If set to "false", visualizer is not used (default value is "true")                                                |
| `update`  | Sets the update interval in seconds for the visualizer                                                             |
| `start`   | Sets the start time in seconds for visualization. This has nothing todo with the run time of the actual simulation |
| `end`     | Sets the end time in seconds for visualization. This has nothing todo with the run time of the actual simulation   |
| `loader`  | Sets where the visualizer is loaded from using the Java-class (see previous listing)                               |

_Basic Configuration of file visualizer_

#### Interaction record

Each interaction record is derived from a certain interaction type and composed of several entries,which are separated by Element `separator`. 
 
The configuration of the file visualizer is explained at the example of the `VehicleUpdates` interaction:

```xml
<subscription id="VehicleUpdates" enabled="true">
	<entries>
		<entry>"UPDATE_VEHICLE"</entry>
		<entry>Time</entry>
		<entry>Updated:Name</entry>
		<entry>Updated:Speed</entry>
		<entry>Updated:Position.Latitude</entry>
		<entry>Updated:Position.Longitude</entry>
	</entries>
</subscription>
```
_Specific Configuration for interaction_

* Attribute `id` indicates the interaction type, namely the class name of the interaction.
* The element `entries` defines the format and content of the finally visualized subscription record.
* The element `entries` is composed of several sub-elements `entry`, which correspond to columns of a subscription
record and the sequence of the columns is the same as that of sub-elements entry.

In total, there are three basic types of entries:

#### Constant

Every quoted entry is defined as a constant. The content inside the quotation will be directly written
into each corresponding interaction record.

```xml
<entry>"UPDATE_VEHICLE"</entry>
```
_An example for constant type entry_

#### Basic method

The Basic method type accesses values of the interaction object by using the appropriate `getXXX()` methods. For an entry, the
root object for method invoking is the corresponding interaction class, here `VehicleUpdates`. As this object provides
the simulation time by calling the getter method `getTime()`, the entry `Time` retrieves the requested value. 
If a null object is returned before the last method of cascaded methods is invoked, then `null` will be written
to the corresponding field.
 
```xml
<entry>Time</entry>
```
_An example for constant type entry_

#### Iteration

```xml
<entry>Updated:Id</entry>
```
_An example for method type entry with iteration_

The first part of this example is `Updated` , which means to invoke the getUpdated method of class
`VehicleUpdates`. Then a list of `VehicleInfo` objects is returned. The character `:` indicates the iteration,
which means that for each of the `VehicleInfo` objects in the returned list the `getId` method is invoked.

#### Cascading

```xml
<entry>Updated:Position.Latitude</entry>
```
_An example for method type entry with iteration and cascading_

In this example, there is a dot operation, which is a cascade operation. Here `getPosition` method of `VehicleInfo`
class is called and a `GlobalPosition` object is returned. Then we continuously invoke the `getLatitude`
method of this `GlobalPosition` object.

#### Extended Method

All the methods involved above are the basic methods. There also is some functionality, which we cannot
extract from these existing methods. So an extended method set is offered to meet these requirements
and also as an extension point in the future.

```xml
<entry>TimeInSec</entry>
```
_An example for simple extended method type entry_

With existing methods of `VehicleUpdates` and its super class `Interaction`, we cannot get the timestamp of
a interaction in second. (only `Interaction.getTime`, which returns a time in ns, is available). Here, `getTimeInSec`
is a method extension for `Interaction` class. The extended method set will be listed later.


## Further details

The method type of entry definition supports cascaded iteration as follows:

```xml
<entry>List1:List2:Id</entry>
```
_An example for cascaded iteration_

It is possible to handle several different iterating operations, coming from the entry definition:

```xml
<entry>Senders:Id</entry>
<entry>Receivers:Id</entry>
```
_An example for multi-level iteration_

`getSenders()` and `getReceivers()` are two different iterations. In this case, a combination of both Ids from
the lists will be generated. The result may look like this:

```csv
sender1, receiver1
sender1, receiver2
sender2, receiver1
sender2, receiver2
```
_Visualising result of the above listing_

Note: the longest matched prefix will be considered as the same iterating operation, which means they are in the same level of iteration structure.

## Additional features

#### Limit output on time frame

You can configure the FileVisualizer to write out interactions within a specific frame of simulation time.
This can be configured by setting the `start` and `end` attributes accordingly:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<visualizer id="fileVisualizer" enabled="true" 
			start="300" end="1000" update="5" 
			loader="com.dcaiti.vsimrti.fed.visualizer.FileVisualizerConfig">
	...
</visualizer>
```
_An example for restricting visualization of interactions within a time frame_

#### Compress Output

The tag `<write>file+compress</write>` can be added to the visualizer configuration, in order
to compress the output using gzip compression. This feature is suitable for large-scale scenarios with
many outputs. 


```xml
<visualizer id="fileVisualizer" loader="com.dcaiti.vsimrti.fed.visualizer.FileVisualizerConfig">
	<write>file+compress</write>
	...
</visualizer>
```