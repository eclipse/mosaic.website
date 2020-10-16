---
title: Statistics Visualizer
linktitle: Statistics Visualizer
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 30
menu:
  docs:
    parent: visualization
---

{{% alert note %}}
The Statistics Visualizer is only available with a commercial license of MOSAIC Extended. 
For further information on licences, please refer to our mailing list.
{{% /alert %}}

The Statictics Visualizer is another visualisation tool to easily measure basic simulation outcomes.
With the Statistics Visualizer you will be able to obtain short or detailed results of the simulation,
e.g. travel times or the average speeds of groups of vehicles, or the average flow on induction loops.

## Configuration of Statistics Visualizer

* The main configuration file for all visualizers is located at `scenarios/<scenarioName>/visualizer/visualizer_config.xml`

In order to use the Statistics Visualizer, the attribute `enabled` of the root element `visualizer` must be
set to "true", as shown in the following listing.

```xml
<visualizer id="statistics" enabled="true" loader="com.dcaiti.vsimrti.fed.visualizer.StatisticsVisualizerConfig">
	[..]
</visualizer >
```
_Configuration header for Statistics Visualizer_

## Specification of the Statistics Visualizer

In this section, we take a closer look at the Statistics Visualizer by using examples and demonstrations. For
each type of retrieving data we create a `<statistic></statistic>` block. Inside the block we define
one certain data type we want to retrieve in a <source> element. If you want to retrieve different data
types, just create another `<statistic>` block for each of them.

You can also set the wanted file name in the attribute filename of the statistic element. If the
attribute has not been given, each `<statistic>` block will get the name accordingly to the order number,
for example `1. StatisticsVisualizer-Block.csv`.

In the output attribute two options (`short`|`verbose`) can be selected. The short option provides us
a compact log file with information about only the highest level of the retrieved data (e.g. aggregate
values of grouped vehicles) in contrast to verbose option which also provides informations about every
individual vehicle in each group.

For a successful start, the element source must be placed in the first position in the `statistic` children
element list. Different options of possible data types, one of which must be specified in the source
element can be seen below.

```xml
<statistic filename="ChooseItYourself" output="short">
	<source>NameOfSource</source>
</statistic>
```
_Source options of Statistics Visualizer_

## Application of the Statistics Visualizer

This section will demonstrate the basic idea and usage of the Statistics Visualizer depending on the
individual requirements. Besides the retrieving raw data, the Statistics Visualizer has further features for
processing of the obtained data.

1. `source`: Data to obtain, choose between:
    * `VehicleSpeeds` - Obtain the speeds of the vehicles of each simulation step.
    * `VehicleStops` - The total number of stops during the journey of each vehicle.
    * `VehicleTravelTimes` - The total travel time in s of the vehicles.
    * `VehicleDelayTimes` - The deviation of the travel time compared to the fastest travel time possible for the vehicles (in s).
    * `VehicleTravelledDistances` - The travelled distance inmof the vehicles.
    * `VehicleFuelConsumptions` - The fuel consumptions of the vehicles in l per km.
    * `VehicleHeadways` - Obtain the headway towards the leading vehicle of each vehicle for each simulation step. To obtain this value, an application has to be deployed on the vehicles which activates the front distance sensor.
    * `DetectorFlow` - The flows of each subscripted induction loop.
    
{{% alert note %}}
For using the detector flow type, inductions loops need to be configured in the SUMO and mapping configuration files (e.g. Highway tutorial).
{{% /alert %}}

2. `group-by`: The vehicles will be grouped by its vehicle type name (`VehicleType`), group they belong
to (`VehicleGroup`), or obtained data value (e.g. `Interval:200` categorizes values into groups of
size 200).

3. `aggregation`: `Average` | `Harmonic` aggregation of the obtained values. An attribute `deviation`
can be set to true or false (it’s false if the attribute is not given). This attribute can be used for
grouped values to get the deviation of each value from the aggregated group value or to get a
standard deviation based on biased sample variance for groups (in the short output version).

4. `filter`: Filtering with the attribute `filterType` (possible values are `keep` and `remove`).

    * Filtering by required value slots with two options to specify them: `MoreThan:Value` or `LessThan:Value` (e.g. `MoreThan:5` to collect values which are bigger than 5 only)
    * Filtering by vehicle type. `VehicleType:Type` (e.g. `VehicleType:Car` to collect values only of vehicles of type "Car")
    * Filtering by time. `Time:From-To` (e.g. `Time:0-100` to collect values only of the first 100s of simulation time)

The following example will show an example of how you can specify the Statictics Visualizer according to
your desired criteria. VehicleTravelTimes are the data we want to retrieve from vehicles and we want
to group vehicles by the abstract group we can define in mapping configuration file (see e.g. Barnim
scenario) and then calculate the average vehicle travel time value for each of these groups.

```xml
<visualizer id="statistics" enabled="true" loader="com.dcaiti.vsimrti.fed.visualizer.StatisticsVisualizerConfig">
	<statistic filename="AverageVehicleTravelTimes" output="short">
		<source>VehicleTravelTimes</source>
		<group-by>VehicleGroup</group-by>
		<aggregation>Average</aggregation>
	</statistic>
</visualizer>
```
_Getting the Average time by vehicle class_

You can also combine filters if you want to get a certain interval with upper and lower boundaries. With
the following input instruction, only vehicles with the obtained data values between 250 and 500 will be
left after filtering.

```xml
<filter filterType="keep">LessThan:500</filter>
<filter filterType="remove">LessThan:250</filter>
```
_An example for filtering_

Please notice that some sources are being not only obtained in each simulation step but also collected for
further processing as separate values for each of these steps (like `VehicleSpeeds`, `VehicleHeadways`).
These data types need to be aggregated to one value per vehicle if you want to group them by value or
filter them.

For demonstration, the StatisticsVisualizer is configured for the scenario Barnim and calculates the
average travel times of the vehicles and additionally groups them. As a result, the simulation produces
the following CSV file in the log directory:

```csv
Group;Value;Total;
AdHoc;399.14;24;
Cellular;463.87;12;
Unequipped;459.18;84;
```
_The AverageVehicleTravelTime.csv file produced by the Statistics Visualizer in the Barnim scenario_

