---
title: Basics in Application Development
linktitle: Basics
toc: true
type: docs
date: "2019-08-06"
draft: false
weight: 1
menu:
  docs:
    parent: develop_applications
    weight: 1
---

Applications in Eclipse MOSAIC are simulated by the [Application Simulator](/docs/simulators/application_simulator). Such 
an application is programmed in Java and follows an event-based execution flow. Thereby, certain methods of the application are called by 
the Application Simulator upon corresponding events (the application "reacts"). To actively gain execution at some later point in time, an 
application can also schedule a generic event itself. When the application is executing, it has access to a set of methods, allowing to 
trigger actions like sensing messages or controlling the vehicle, influencing the current simulation (the application "acts").

## Developing Applications

Developing custom applications in Eclipse MOSAIC is rather easy. The best way to learn it is by looking at the
source code of actual applications. For this purpose, we provide the source code of all tutorial applications
and further examples.

For an easy understanding of the application API, the following questions and their answers should
help:

* What is required to get my own application to run in Eclipse MOSAIC?
In Eclipse MOSAIC it is very easy to build your own application. First, it needs to inherit from the `AbstractApplication`
class (see following section). Secondly, the application must be mapped to
a vehicle (or RSU, or traffic light, ...) via the mapping configuration (see section [mapping](/docs/scenarios#applications-and-mapping)). Finally,
the application must be compiled as a Jar-File and placed into the application directory of your
scenario.

* How can I access vehicle functions from within the application, such as sending V2X messages?
Every application has access to the `OperatingSystem` of the underlying unit which allows to
change its state or to initiate actions, such as sending messages to other vehicles.

* How can I react to events during the simulation, such as receiving V2X messages?
For each application you decide, which events the application should listen to. For example,
if your application needs to react upon incoming V2X messages, it simply implements the `CommunicationApplication`
interface. In the following section you can find all available interfaces
applications can implement.

## Create a ’Hello world’ application based on Maven

For this example you need to install [Maven](https://maven.apache.org/download.cgi) which is used
to resolve required MOSAIC dependencies and to compile your application Java code into a Jar file.
Follow the steps to build an example application:

1. Create a new folder `HelloWorldApp`:
    ```plaintext
    └─ HelloWorldApp
       ├─ src
       |  └─ main
       |     └─ java
       |        └─ HelloWorldApp.java
       └─ pom.xml
    ```
2. Place a `pom.xml` with the following content:
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
        <modelVersion>4.0.0</modelVersion>
    
        <groupId>org.eclipse.mosaic.app</groupId>
        <artifactId>HelloWorldApp</artifactId>
        <version>0.0.1</version>
        <packaging>jar</packaging>
   
        <properties>
             <maven.compiler.source>1.8</maven.compiler.source>
             <maven.compiler.target>1.8</maven.compiler.target>
        </properties>
      
        <repositories> 
            <repository>
                <id>repo.eclipse.org</id>
                <name>MOSAIC Repository</name>
                <url>https://repo.eclipse.org/content/repositories/mosaic</url>
            </repository>
        </repositories>
                  
        <dependencies>
            <dependency>
                <groupId>org.eclipse.mosaic</groupId>
                <artifactId>mosaic-application</artifactId>
                <version>{{< version of="mosaic" >}}</version>
            </dependency>
        </dependencies>
        
    </project>
    ```
3. Create a new application in `src/main/java/HelloWorldApp.java`:
    ```java
    import org.eclipse.mosaic.fed.application.app.AbstractApplication;
    import org.eclipse.mosaic.fed.application.app.api.VehicleApplication;
    import org.eclipse.mosaic.fed.application.app.api.os.VehicleOperatingSystem;
    import org.eclipse.mosaic.lib.objects.vehicle.VehicleData;
    import org.eclipse.mosaic.lib.util.scheduling.Event;
   
    public class HelloWorldApp extends AbstractApplication<VehicleOperatingSystem> implements VehicleApplication {
        
        @Override
        public void onStartup() {
            getLog().info("Hello World!");
        }
   
        @Override
        public void onVehicleUpdated(VehicleData previousVehicleData, VehicleData updatedVehicleData) {
            getLog().info("Driving {} m/s.", updatedVehicleData.getSpeed());
        }
    
        @Override
        public void onShutdown() {
            getLog().info("Good bye!");
        }
    
        @Override
        public void processEvent(Event event) {
            // ...
        }
    }
    ```
4. Build the application using maven:
    ```shell
    mvn clean install
    ```
5. Copy the JAR file from `target/HelloWorldApp-0.0.1.jar` to the `application` directory of your simulation scenario.
6. Use the fully qualified name `HelloWorldApp` in the `mapping_config.json` to load the application onto vehicles. 

## Application Interfaces

You may have noticed that the `HellowWorldApp` extends from the class `[...].AbstractApplication<OS>`. 
In order to define the type of unit your application can run on, you need to speficy the operating system by choosing one of the following:

* `VehicleOperatingSystem` - for applications mapped to normal vehicles.
* `ElectricVehicleOperatingSystem` - for applications for vehicles with electro mobility features.
* `RoadSideUnitOperatingSystem` - for applications mapped to RSUs.
* `TrafficLightOperatingSystem` - for applications mapped to traffic lights.
* `TrafficManagementCenterOperatingSystem` - for applications mapped to TMCs.
* `ChargingStationOperatingSystem` - for applications mapped to charging stations.

_See package:_ `org.eclipse.mosaic.fed.application.app.api.os.*`

Furthermore, your application can implement the following 7 interfaces in order to get informed on specific events:

* `VehicleApplication` - get informed when information about the vehicles state is updated.
* `ElectricVehicleApplication` - get informed on electric vehicle specific events.
* `CommunicationApplication` - react on incoming V2X messages.
* `MosaicApplication` - get informed on Eclipse MOSAIC internal events.
* `TrafficLightApplication` - get noticed when the traffic light program is changed.
* `ChargingStationApplication` - react on state changes of the charging station.
* `TrafficManagementCenterApplicatio`n - get informed on state changes of road infrastructure.

_See package:_ `org.eclipse.mosaic.fed.application.app.api.*`

--- 

## Basic Functions and Concepts for Applications

The following section describes how applications are implemented.

### Event hooks

Applications are implemented by reacting to specific events. Those events are, amongst others:

* The simulation has started: All static units (e.g. road side units) are set up (`onStartup()` is called)
* Once a vehicle has been added to the simulation, all its configured applications are initialized (`onStartup()` is called)
* The data of the vehicle has changed, e.g. after the traffic simulator has finished one simulationstep (`onVehicleUpdated()` is called).
* A unit has received a V2X message from another entity (`onMessageReceived` is called).
* A unit which has send a V2X message via a ITS-G5 topocast receives an acknowledgement (`onAcknowledgementReceived()` is called).

Another example:

{{< svg src="images/application_events.svg" >}}

_Example sequence of onStartup, onUpdate, onMessageReceived and onShutdown of two applications._

A `onStartup()` method, which enables the ITS-G5 communication module of the unit, could be implemented the following:

```java
@Override
public void onStartup() { 
    getOs().getAdHocModule().enable(new AdHocModuleConfiguration()
            .addRadio().channel(AdHocChannel.CCH).power(50).create()
    );
}
```

A `onMessageReceived()` method, which reacts upon a **DENM** message, could be implemented as:

```java
@Override
public void onMessageReceived(ReceivedV2xMessage receivedV2xMessage) {
    final V2xMessage msg = receivedV2xMessage.getMessage();

    if (msg instanceof Denm) {        
        Denm denm = (Denm)msg;
        GeoPoint eventLocation = denm.getEventLocation();
        //TODO you can add further implementation here
    }
}
```

### Trigger own Events

It is possible to trigger own events at specific times within the application. For this purpose, the application has access to an own event manager. Each event requires a 
simulation timestamp when it should be called, and an event processor.

The following code triggers an event in 10 seconds after the application has been initialied:
```java
@Override
public void onStartup() {
    Event event = new Event(getOs().getSimulationTime() + 10 * TIME.SECOND, this);
    getOs().getEventManager().addEvent(event);
}

@Override
public void processEvent(Event event) {
    getLog().info("Event has been triggered");
    // TODO
}
```

To address a specific method to process the event, Java lambda expressions could be used:

```java
@Override
public void onStartup() {
    Event event = new Event(getOs().getSimulationTime() + 10 * TIME.SECOND, this::mySpecificMethod);
    getOs().getEventManager().addEvent(event);
}

public void mySpecificMethod(Event event) {
    getLog().info("Event has been triggered");
    // TODO
}
``` 

### Using the Operating System

Each application has access to the operating system of its unit. Depending on the type of unit, the operating system provides different methods. For example, 
an application which is mapped on vehicles, has access to the `VehicleOperatingSystem` by calling `this.getOperatingSystem()` (or `this.getOs()` to keep it short). The following examples show a bit 
of the capabilities the `VehicleOperatingSystem` provides:

Get the current simulation time (in nanoseconds):
```java
long time = this.getOs().getSimulationTime();
```
Return the name of the unit (e.g. "veh_0"):
```java
String nameOfUnit = this.getOs().getId();
```
Get access to vehicle data, such as speed, position, heading, and the like:
```java
double speed = this.getOs().getVehicleData().getSpeed();
GeoPoint position = this.getOs().getVehicleData().getPosition();
``` 
Change parameters of the vehicle during the simulation, such as its maximum speed:
```java
this.getOs().requestVehicleParametersUpdate()
        .changeMaxSpeed(10) // m/s
        .changeMaxAcceleration(2.4)
        .apply();
``` 
Get the current lane index of the vehicle and change lane to left (within 5000 ms):
```java
int laneIndex = this.getOs().getRoadPosition().getLaneIndex();
int newLaneIndex = Math.max(0, laneIndex - 1);
this.getOs().changeLane(newLaneIndex, 5000);
```
Sending a V2X message via ITS-G5 singlehop broadcast:
```java
MessageRouting routing = this.getOs().getAdHocModule().createMessageRouting().topoBroadCast();
V2xMessage message = new MyV2xMessage(routing);
this.getOs().getAdHocModule().sendV2xMessage(message);
```
Park the vehicle in 200 meters at the right side of the road for 3 minutes:
```java
double distance = 200;
double duration = 3 * 60 * 1000;
IRoadPosition stopPosition = RoadPositionFactory.createAlongRoute(
        getOs().getNavigationModule().getRoadPosition(),
        getOs().getNavigationModule().getCurrentRoute(),
        0,
        distance
);
this.getOs().stop(distance, duration, Stop.StopMode.PARK);
```
 
### Navigation

The navigation of vehicles (i.e. calculation of routes) is handled completely by the [Application Simulator](/docs/simulators/application_simulator#eclipse-mosaic-application-simulator). Each vehicle is equipped
with a navigation system which provides all required information and functions for navigational purposes:

* Retrieve the current position and heading of the vehicle.
* Get the target of the vehicle.
* Calculate various routes from the current position to an arbitrary target.
* Choose a suitable route out of existing ones from the current position to an arbitrary target.
* Switch onto a specific route.

In order to provide routing functionality, a map model based on Open Street Map data is used, which
needs to be transformed before the simulation using scenario-convert. The map data including initial
routes for vehicles is provided with the database file which needs to be located in
`mosaic/scenarios/<scenario_name>/application/<scenario_name>.db`

#### Configuration

If the database needs to be located somewhere else, the path can be specified in
`mosaic/scenarios/<scenario_name>/application/application_config.json`:

```json
{
    ...
    "navigationConfiguration": {
        "databaseFile": "path/to/scenario.db"
    }
}
```

The following snippet show, how the navigation system can be used within an application:

```java
//get navigation module
INavigationModule navigationModule = getOs().getNavigationModule();

//choose current target as target position
RoutingPosition targetPosition = new RoutingPosition(navigationModule.getTargetPosition());

//set routing parameters to fastest route search
RoutingParameters params = new RoutingParameters().costFunction(IRoutingCostFunction.Fastest);

//calculate routes
RoutingResponse response = navigationModule.calculateRoutes(targetPosition, params);

//switch to best route
if (response.getBestRoute() != null) {
    boolean routeSwitched = navigationModule.switchRoute(response.getBestRoute());
    ...
}
```

### Access SUMO TraCI from applications

If SUMO is used as a traffic simulator and a special functionality is required, the `sendSumoTraciRequest`
function in the `OperatingSystem` can be used.

The function expects a string (a unique identifier which will be assigned to the response) and a byte array
(representing the complete Traffic Control Interface (TraCI) request including the header). The message
identifier can be an empty string.

In all cases the command will trigger a response. The application can receive the response from the
method `onSumoTraciResult`. This method will receive a `SumoTraciResult`
object. This response contains the specified identifier. The application must handle the
identification process of the response itself.

{{% alert note %}}
Be careful when using this interface and the TraCI commands. The
commands are delivered to TraCI without any prior checks.
{{% /alert %}}

{{% alert note %}}
You can find the example application SumoTraciInteractionApp
in the additional examples bundle on the {{< target-blank "DCAITI website" "https://www.dcaiti.tu-berlin.de/research/simulation/download/" >}}.
{{% /alert %}}

---

## Debugging of applications

To debug an application, remote debugging needs to be used. The following steps need to be performed
in order to debug the application:

1. Open the application in your IDE.
2. Modify your `mosaic.sh` or `mosaic.bat` by adding debug parameters to the java call:\
  `java -agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=4100 ...`
3. Add a new debug profile in your IDE for remote debugging. Make sure to correctly configure port `4100` (or whichever port you provided in step 2).
4. Launch Eclipse MOSAIC with the argument `-w 0` to disable the watchdog timer otherwise it will interfere with debugging.
5. Connect your debugger in your IDE with the running simulation.



