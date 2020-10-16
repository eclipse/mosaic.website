---
title: Sumo Ambassador Implementation
linktitle: Sumo Ambassador
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 50
menu:
  docs:
    parent: extending_mosaic
---

The Simulation of Urban Mobility (SUMO) simulator is an open source microscopic, multi-modal traf-
fic simulation package which is developed by the Institute of Transportation research at the German
Aerospace Centre. It is designed to handle large road networks faster than real-time. Each vehicle has
an own route and is simulated individually. To simulate the movements of the vehicles on the network,
a model is used that uses discrete time steps of e.g. 1 s. Thousands of vehicles can be simulated in real
time on a desktop PC, including simulation of traffic lights, right-of-way rules, and lane changing models.
Simulations can either run via the command line or are visualized using the openGL-API (SUMO-GUI).
SUMO networks are created by importing other formats, such as OpenStreetMap data, Shapefiles or
TIGE-maps; or by generating artificial networks. Furthermore, vehicle routes, based on different routing
paradigms, can be computed.

### SUMO and Eclipse MOSAIC

We have integrated the traffic simulator SUMO to be able to simulate heterogeneous driving vehicles and a set of vehicles that have a predefined routes based on an imported roadmap. Additionally, during
the runtime of a simulation, it is possible that routes of simulated vehicles are changed and that vehicle positions are extracted at arbitrary points in time. The integration of SUMO into a Eclipse MOSAIC based simulation is illustrated in the following figure. The integrated Traffic Control Interface (TraCI) Server offers an interface to exchange commands and positions using a socket interface with a proprietary byte protocol. Analogous to the TraCI Server, a TraCI Client is implemented that is integrated in an ambassador implementing the TraCI protocol. Therefore, SUMO can be integrated without modifications.

{{< figure src="../images/sumo-connected-to-mosaic.jpeg" title="SUMO connected to Eclipse MOSAIC" numbered="true" >}}

During a simulation run, per default SUMO is paused and TraCI is listening for commands. After each
advanced time grant, SUMO offers the new vehicle positions which are broadcast by its ambassador
to other federates. Furthermore, if the ambassador receives a request to change the route of a specific
vehicle, it is forwarded to SUMO. Thus, at the next time-advancement, the new route is integrated.

### Simulation of Vehicles

For each vehicle which has been defined in the mapping3 configuration, a `VehicleRegistration` interaction is sent
to the `SumoAmbassador` which adds those vehicles to the simulation via TraCI. Furthermore, vehicle
data is subscribed which is updated with every simulation step. After each step of the simulation this
data is bundled into a `VehicleInfo` object which is distributed among other ambassadors within the
`VehicleUpdates` interaction. The following data is available for each vehicle:
* Position
* Speed, Acceleration, Heading, Slope
* State of vehicle signals (e.g. turn indicators)
* Emission dispersion (CO2, NOX, etc.)
* Fuel consumption
* Information about the road the vehicle is driving on (road position)
* Id of the route

### Traffic lights in SUMO

Depending on which light is active (red, yellow or green), every traffic light got different phases. In theory,
any combination of dis- or enabled lights is possible, but SUMO only handles combinations which make
sense. In SUMOs traffic light concept every traffic light got a bitset of the status of each phase. Every
bitset is a combination as mentioned above. When a car approaches a junction, it gets the actual bitset
(combination) of the traffic light. To explain the code, an example is given:

```xml
<tl-logic type="static">
    <key>0</key>
    <subkey>my program</subkey>
    <phaseno>8</phaseno>
    <offset>0</offset>
    <phase duration="31" state="GGggrrrrGGggrrrr"/>
    <phase duration="5" state="yyggrrrryyggrrrr"/>
    <phase duration="6" state="rrGGrrrrrrGGrrrr"/>
    <phase duration="5" state="rryyrrrrrryyrrrr"/>
    <phase duration="31" state="rrrrGGggrrrrGGgg"/>
    <phase duration="5" state="rrrryyggrrrryygg"/>
    <phase duration="6" state="rrrrrrGGrrrrrrGG"/>
    <phase duration="5" state="rrrrrryyrrrrrryy"/>
</tl-logic>
```

This example shows the traffic light program of one junction. It shows the different status’ of each light
of each traffic signal, which are positioned on the junction. In this example every string of a phase e.g.
"GGggrrrrGGggrrrr" (first phase) got 16 characters. Every char stands for one light on the junction. On
this junction are four traffic lights with four signals each. To understand the different status of each light
in one period (8 phases) the program should be read from top to the bottom. It is possible to change or
create your own program by editing the .net file with the tool Netedit.

### Handling of traffic lights in Eclipse MOSAIC

After the TraCI connection has been established, all available traffic light groups are read out of SUMO via
TraCI. This information is packed into the three classes `TrafficLightGroup`, `TrafficLightSignal`,
and `TrafficLightPhase`. While a traffic light group contains a list of signals which control one intersec-
tion (which can consist of several nodes), a list of all existing traffic light groups is sent to the RTI via a
`ScenarioTrafficLightRegistration` interaction.

### TraCI Client Implementation

The SumoAmbassador communicates with the federate (SUMO process) via TraCI. In this socket based
communication protocol, the server (SUMO) listens to commands and responds accordingly.

Each message send to SUMO consist of a header and the command or result message, according to the
following scheme:

```
 0                7 8                15
+--------------------------------------+
| Message Length including this header |
+--------------------------------------+
|      (Message Length, continued)     |
+--------------------------------------+  \
|      Length      |    Identifier     |  |
+--------------------------------------+   > Command / Result_0
|      Command / Result_0 content      |  |
+--------------------------------------+  /
...
+--------------------------------------+  \
|      Length      |    Identifier     |  |
+--------------------------------------+   > Command / Result_n -1
|     Command / Result_n-1 content     |  |
+--------------------------------------+  /
```

A more detailed description can be found here: [http://sumo.dlr.de/wiki/TraCI/Protocol](http://sumo.dlr.de/wiki/TraCI/Protocol)

#### Commands

Each TraCI command is identified by an command identifier. For example, the command 0xC4 is used to
change the state of a vehicle. Most of the commands need further specification, such as the parameter of
the vehicle which is required to be changed. Those parameters are usually accessed by variable identifiers
(e.g. 0x40 addresses the speed of an entity). A full list of commands and variables supported by TraCI can
be found here: [http://sumo.dlr.de/wiki/TraCI](http://sumo.dlr.de/wiki/TraCI)

Here is an example of a command message to change the speed of the vehicle "veh_0" to 14m/s:

```
 0                 7 8                 15                23 24               31
+-----------------------------------------------------------------------------+
|                             25 (Message length)                             |
+-----------------------------------------------------------------------------+
|    21 (Length)    |  0xC4 (Command)  |   0x40 (Variable) |       
+-----------------------------------------------------------------------------+
             5 (String length as 4 Byte Integer)           |        "v"       |
+-----------------------------------------------------------------------------+
|        "e"        |        "h"       |        "_"        |        "0"       |
+-----------------------------------------------------------------------------+
| 0x0B (Double type)|                   40.0 (8 Byte Double) 
+-----------------------------------------------------------------------------+
             
+-----------------------------------------------------------------------------+  
                    |
+-------------------+
```

#### AbstractTraciCommand

In the TraCI client implementation of the `SumoAmbassador` the whole construction of messages is done in
the class `AbstractTraciCommand`. The message header containing the message and command lengths
is constructed automatically as well as all parameters defined by the specific command. To achieve this,
each class which extends the `AbstractTraciCommand` needs to define the command, the variable and
all parameters which are required for the specific command:

```java
protected VehicleSetSpeed() {
    super(TraciVersion.LOWEST);

    write()
        .command(0xC4)                // = change vehicle state
        .variable(0x04)               // = set speed of entity
        .writeStringParam()           // = vehicle id
        .writeDoubleParamWithType();  // = speed value
}
```

This example shows the command implementation for setting the speed for a vehicle. In the constructor,
the write methods provides a builder-like construct allowing to define the command, the variable, and all
parameters which are later passed dynamically to the command. Here, the command is specified as `0xC4` (= change vehicle state) and the variable as `0x04` (= speed of the entity). Furthermore, two parameters are
defined: The first string parameter represents the ID of the vehicle, the second double parameter defines
the speed value to be set (according to [http://sumo.dlr.de/wiki/TraCI/Change_Vehicle_State](http://sumo.dlr.de/wiki/TraCI/Change_Vehicle_State)).
Note, the order of the specified command contents is from crucial importance. E.g. the `command` must
always be specified before the `variable`, and the variable before all parameters.

All parameters defined in the constructor (here: `[String, Double]` ), need to be assigned with values
as soon as the command is executed. For this purpose, the command implementation needs to call the
method execute of the super class with the parameter values in the specified order:

```java
public void setSpeed(TraciConnection traciCon, String vehicleId, double speedValue) {
    super.execute(traciCon, vehicleId, value);
}
```

Within the execute method, the `AbstractTraciCommand` constructs the whole message and sends it to
the TraCI server (SUMO). Furthermore, the `AbstractTraciCommand` also reads the response, extracts the
status of the response (successful or error) and reads all values returned by the server. Usually, commands
which changes the state of an entity only (like `VehicleSetSpeed`) do not respond with complex results.
However, a command which wants to retrieve a value of an entity needs to read out the result from the
response (e.g. `VehicleGetRouteId` which returns the current route identifier of the vehicle). For this
purpose, each command needs to specify how the response should be handled:


```java
protected VehicleGetRouteId() {
    super(TraciVersion.LOWEST);

    write()
        .command(0xA4)      // = retrieve vehicle state
        .variable(0x53)     // = route id of entity
        .writeStringParam(); // = write vehicle id

    read()
        .skipBytes(2)          // = skip command and variable in response
        .skipString()          // = skip vehicle id, not relevant
        .readStringWithType(); // = read route id
```

This example shows the command implementation for getting the route id of a vehicle. As well as `write`,
the method read returns a builder-like construct which provides methods to define how the response is
handled. Here, the first two bytes of the response should be skipped, as well as the string which follows
afterwards. The value the command is interested in is the following string value which holds the id of
the route. By using the method `readStringWithType` the string is read out and is passed to the method
`constructResult` which needs to be implemented by the command as well:

```java
public String getRouteId(TraciConnection con, String vehicle) {
    return super.executeAndReturn(con, vehicle);
}

@Override
protected String constructResult(Status status, Object... objects) { 
    return (String) objects[0];
}
```

In this simple case the result of the command consists of one result object only (the route id). Therefore,
it is just extracted from the array of result objects and directly returned.

#### Writing parameters

In order to write parameters and read results according to the specification of the protocol, several reader
and writer implementations exist. For parameters to be written in the command various writers exists
to write single bytes, strings, integers, and doubles, or special writers for writing lists. The same is for
readers.

In the following example, the IntegerTraciWriter is shown:

```java
public class IntegerTraciWriter extends AbstractTraciParameterWriter<Integer> {

    public IntegerTraciWriter() {
        super(4); 
    }

    public IntegerTraciWriter(int value) {
        super(4, value); 
    }

    @Override
    public int getVariableLength(Integer argument) {
        return getLength();
    }

    @Override
    public void write(DataOutputStream out) throws IOException {
        out.writeInt(value);
    }

    @Override
    public void writeVariableArgument(DataOutputStream out, Integer argument) {
        out.writeInt(argument);
    }
}
```

Each writer has two tasks. Firstly, it needs to determine the length of the parameter value. For example,
an integer parameter is always 4 bytes long, whereas the length of a string parameter depends on the
size of the argument. Therefore, each writer needs to be able to determine the variable length according 
to a given value. Secondly, it needs to write out the actual value into the `DataOutputStream` (which
represents the channel to the TraCI server). Furthermore is each writer able to write fixed values, such as
the command identifier which does not change, or variable arguments, such as the vehicle id.

#### Reading results

In the following example, the IntegerTraciReader is shown:

```java
public class IntegerTraciReader extends AbstractTraciResultReader<Integer> {

    public IntegerTraciReader() {
        super(null);
    }

    public IntegerTraciReader(Matcher<Integer> matcher) {
        super(matcher);
    }

    @Override
    protected Integer readFromStream(DataInputStream in) throws IOException {
        return readInt(in);
    }
}
```

A reader has three tasks. Firstly, it reads out a value from the `DataInputStream` (which represents the
response channel to the TraCI client) according to the protocol specification. For example, an integer
can be read out directly, while a string requires several single reading operations. Secondly, the reader
needs to take track of the number of bytes it has read in total. To achieve this it is recommended to use
the provided methods of the super class, such as `readInt`, `readString`, or `readByte` .However, if values
need to be read directly from the DataInputStream, the protected field `numBytesRead` must always be
increased accordingly. Thirdly, the reader needs to define if the read out value fulfils certain requirements.
Such requirement can be, that a certain value is expected. In this case, a matcher might be passed to the
super constructor.

#### Accessing the commands

For each command, only one object should be instantiated during runtime. To achieve this, the
`CommandRegister` is used. This class stores a command once it is created returns only one instance per
command class:

```java
final RouteAdd routeAddCommand = commandRegister.getOrCreate(RouteAdd.class);
//... do something
```

However, commands should not be accessed directly in the code, but rather using the various facades
available:
* `TraciRouteFacade` - Route specific command calls, such as addRoute and getRouteEdges .
* `TraciSimulationFacade` - Provides methods to control the simulation, such as simulateStep .
* `TraciTrafficLightFacade` - Provides methods to get or set values for traffic lights.
* `TraciVehicleFacade` - Provides methods to get or set values for vehicles.
All those facades can be accessed via the `TraciClient`.

#### Exception handling

Exceptions are thrown and handled as following:

* If a command results in a status response with the status code Error, a `TraciCommandException`
is thrown. If this exception is thrown, the TraCI connection is still alive and can be used for
further commands. The facades decide how to handle this exception then and may throw an
`InternalFederateException` or log a warning message.

* If a command could not be written properly, or the result could not be read out as wished, an
`InternalFederateException` is thrown and an `Emergency Exit` is initiated, which eventually
shuts down the TraCI connection. This also happens if a reader or writer throws any kind of
Exception.

#### Version handling

With future releases of SUMO new TraCI commands will emerge. To achieve downward compatibility
each command can define the lowest TraCI Version it supports. For example, a command which was
introduced with SUMO 0.30.0 and is annotated accordingly, would be skipped automatically if the version
of the TraCI server is lower. However, this concept has not been tested yet properly.
