---
title: Application Ambassador - Implementation Details
linktitle: Application Ambassador
toc: true
type: docs
date: "2020-08-06"
draft: false
weight: 40
menu:
  docs:
    parent: extending_mosaic
---

The Application Simulator is completely implemented as an Eclipse MOSAIC Ambassador in Java. The main class `ApplicationAmbassador` is 
started by the RTI and creates different components, like the `SimulationKernel` singleton or the `CentralNavigationComponent`. 
Subsequently, it will find all the Java Archive (JAR) files in the `application` configuration directory, belonging to the currently started 
scenario, and add their classes to the class path. These JARs contain the application classes. Furthermore, the ApplicationAmbassador is 
registered as a handle for different Eclipse MOSAIC messages in the configuration file `etc/runtime.json` in the Eclipse MOSAIC folder. After 
initialization, the Application Simulator will receive these messages from Eclipse MOSAIC when they appear and perform corresponding actions.

### Node Creation
{{< figure src="../images/class_overview.png" title="Application Simulator basic flow / node creation classes" numbered="true" >}}

Application classes are only instantiated when a node, carrying that application, is created. This is signaled by messages for node creation 
like (`AddedVehicle,AddedRsu,AddedTrafficLight`, ...). When the `Mapping` ambassador spawns a new node, it will send those messages to the 
RTI. The message then contains the fully qualified names of all applications associated with the spawned node, as well as the vehicle type 
itself.  Depending on this type, the Application Simulator creates a new `SimulationUnit` object (i.e. a subclass of `SimulationUnit` like 
`Vehicle`, `RoadSideUnit` or `TrafficLight`), representing the new node. This task is served by the `UnitSimulatorclass`, which performs 
book keeping of all `SimulationUnits`. Upon Creation of a node, the `UnitSimulator` will schedule an event to start all applications, 
belonging to the new node. The required information is saved in a `StartApplications` object, which also includes a `ApplicationUnit` 
object, an abstract representation of a node (a.k.a. unit) having at least one application. 

However, as, for example, SUMO does not simulate vehicles strictly from their creation on, but only since their first movement, Applications 
for vehicles cannot be started directly upon an `AddedVehicle` message. Instead, every added vehicle will be kept in the `addedVehicles` 
Map, until a `VehicleMovements` message, belonging to that vehicle is processed. The vehicle will then be added by the `UnitSimulator` 
like any other node.

### Other Messages and Time Advance

Apart from the ones for node creation, there are many other messages (see {{< link title="Interaction" href="/docs/extending_mosaic/interactions/" >}}), 
signaling events to the Application Simulator. For most of them, an event in the future will be programmed, such that the implied action is 
carried out at that simulation time. The processing of the events happens when the RTI calls the `advanceTime()` method on the ambassador. 
Upon this, Application Simulator will obtain a list of all events up to the new time and let the processor of the event process them. Every 
potential event processor implements the `EventProcessor` interface. The corresponding method is the `advanceTime()` method of 
`ApplicationAmbassador`, which calls `scheduleEvents()` on the event scheduler. Subsequently, some interesting messages and their 
handling process is sketched shortly:

 Message | Description |
| :--- | :--- |
| `VehicleUpdates` | Signals that a vehicle has moved.  The `Vehicle` object, which is a subclass of `SimulationUnit`, that corresponds to the moved vehicle will be updated to contain the new position. The new information is encapsulated in a `VehicleInfo` object, containing different vehicle data. To update the data, an event is scheduled at the given time and processed upon time advance. Vehicles not yet added to the simulation (see [Node Creation](#node-creation)), are added by calling `addVehicleIfNotYetAdded()`.|
| `MessageReceiption` | This message represents the reception of a V2X-message by a simulated node. The `SimulationUnit` with the id saved in the `ReceivedV2XMessage` object is scheduled for the processing of the message at the given simulation time. When simulation time reaches the reception time, the `SimulationUnit` will obtain the message from the message cache and hand it to all applications that implement the `CommunicationApplication` interface in the method `SimulationUnit.processReceiveV2XMessage()`.|
| `ApplicationInteraction` | While most other messages are specific to the a `SimulationUnit`, that then forwards the event to its applications, the `ApplicationSpecificMessage` is directly handed to all applications.  Thereby, the `SimulationUnit`, whose applications shall receive the message can be specified. If this is not done, all applications of all units will get the message and have the opportunity to handle it. |