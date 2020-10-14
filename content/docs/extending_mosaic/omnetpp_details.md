---
title: OMNeT++ Federate Implementation
linktitle: OMNeT++ Federate
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  docs:
    parent: extending_mosaic
    weight: 9
---

The OMNeT++ Federate design is based on amicrosimulation where every participating vehicle respectively
node is individually modeled and simulated and all entities are clued together in a scenario with
one instance the manages the interaction between them. That means at first the internals of one node
are introduced which incorporate mainly the communication stack and a mobilitymodel. Afterwards,
especially the scenario management is presented which builds up on the individual nodes and controls
themajor part of the simulation. These both aspects are in similar way needed formost mobile communication
simulation with OMNeT++ even in an isolated setup. However, specifically for interaction and
synchronization with the other simulators in the Eclipse MOSAIC environment, a third pillar is necessary. This
scheduler module is very important for the system as it implements the time management and event
scheduling according to Eclipse MOSAIC specific concepts.

### Node Internals

The main part of the node model consists of the communication stack. The submodules for communication
are adopted from the INETMANET framework. Hence, it is primarily important to define the
connections between the individual modules. However, there are also modules which needed to be
implemented for the dedicated purpose of the coupling within the Eclipse MOSAIC environment. Finally, all
modules are linked together to a compound module using the NED language. The following figure depicts the node architecture. It needs to be said that the concept currently supports two different
kinds of nodes for Vehicles and RSUs, while V2X-based traffic lights are treated as RSUs. For the first
approach these two kinds of nodes have the equal construction in terms of modules. The difference at the
moment is that they can be configured with different values for parameters e.g. that Vehicles and RSUs
have a different antenna height which is important for Two Ray Ground ReflectionModel. Furthermore,
this concept is capable for later extensions e.g. for simulations when RSUs should be equipped with an
additional network interface to build the bridge fromAd hoc Domain to the Fixed Infrastructure Domain
(i.e. Internet).

{{< figure src="../images/implementation_simcoupling.jpeg" title="Architecture of one Node" numbered="true" >}}

##### Communication Stack

The right part of the block diagram in the figure above depicts the communication stack. It is based on the
module Wlan which is a compound module itself and covers the complete IEEE 802.11 network interface
card with the MAC and PHY Layer and the Radio Channel. The configuration of different values for
standard parameters e.g. the PHY bit rate or size of the contention window of the MAC can be exchanged
within the omnetpp.ini-file (which introduces the parameters of the according module ned-files). Please
note that the configuration allows different values for each kind of nodes and hence it is possible to
configure another propagation model or carrier frequency for Vehicles compared to RSUs. Even if
the possibility for such a configuration exists, it should be avoided and common parameters should
consistently be configured twice with the same value.

The next module in the communication stack is the NetworkLayer. Once again it is a compound module
and already a collection of most important protocols. The following protocols from version IPv4 are
supported in this layer.

* IP (Internet Protocol) of course as primary protocol of the Network Layer
* ICMP (Internet ControlMessage Protocol) for information and error messages
* IGMP (Internet GroupManagement Protocol) for management ofmulticast functionality
* ARP (Address Resolution Protocol) for mapping of IP Addresses toMAC Addresses

Furthermore, the standalone modules InterfaceTable and RoutingTable are related to the Network
Layer. The first one is needed to support multiple Network Interface Cards e.g. for wireless and fixed LAN
in one node. It is already included for possible further extensions as previously mentioned, but up to
now it has only one entry which is the Network Interface Card for Wlan. The second one is a table for
simple Routing. This module is needed for correct instantiation of a node via the FlatNetworkGenerator
as explained later in this section.

The `TransportLayer` of the communication stack is made up of TCP for reliable connections and UDP.

{{% todo %}}scc 10.03.2020 this seems to be outdated{{% /todo %}}
The modules `VSimRTIReliableApp` {{% todo %}}Modulname anpassen{{% /todo %}} and `VSimRTIUnreliableApp` {{% todo %}}Modulname anpassen{{% /todo %}} of Application Layer are the entry
points for application messages for the communication stack for the following reasons. The communication
oriented models of INETMANET have their focus more on the framing for communication and less on
the real content. That means that content is often modeled with dummy payloads where only the length is
of interest. In contrast, V2X applications which are simulated in the [Eclipse MOSAIC Application Simulator](/docs/simulators/application_simulator.md).
Rely on the correct transmission of contents. Hence, the modules {{% todo %}}Modulname anpassen{{% /todo %}} `VSimRTIReliableApp` and {{% todo %}}Modulname anpassen{{% /todo %}} `VSimRTIUnreliableApp`
are introduced to bridge this gap. They are triggered by the Eclipse MOSAIC ScenarioManager
to send new messages to lower layers and forward messages themselves back to the ScenarioManager
upon reception. The main tasks are generally acting as an application within the scope of OMNeT++ and
encapsulating themessage contents to packets to prepare them for sending. While functionality of an
UDP application is fully supported in {{% todo %}}Modulname anpassen{{% /todo %}} `VSimRTIUnreliableApp`, the complete TCP application functionality
is restricted in{{% todo %}}Modulname anpassen{{% /todo %}} `VSimRTIReliableApp`. Note that up to now it is not entirely clarified if and how TCP should
be supported in V2X use cases for safety and traffic efficiency with their broadcast characteristics, think
of different roles of server and client in TCP. When the Eclipse MOSAIC ScenarioManager properties are detailed
later in this section, it is also explained how the connection between the Eclipse MOSAIC ScenarioManager and
the Eclipse MOSAIC Apps is realized. This connection needs to be established dynamically and is therefore not
assigned with a connecting arrow like the fixed connections between the modules of communication
stack.

##### Mobility Model

The second important component of the node is the mobility module {{% todo %}}Modulname anpassen{{% /todo %}} `VSimRTIMobility`, which extends
the BasicMobility. Unlike other mobility models as RandomWaypoint it does not generate node movements
itself and has a straight static character. Node position updates are always triggered by the Eclipse MOSAIC
ScenarioManager. Hence,mobility is completely controlled by Eclipse MOSAIC and in turn by the coupled traffic
simulator. After successful position update the `VSimRTIMobility` {{% todo %}}Modulname anpassen{{% /todo %}} module informs other modules about
this event via the NotificationBoard.

##### Additional Functionality

At last, the module NotificationBoard is defined for each node. This module was already mentioned in
the model overview of INETMANET. It enables a very efficient way for dynamic communication between
the individual modules. There is no direct and static connection needed between the modules, because
modules can subscribe dynamically for notification about dedicated events.

### Simulation Setup

The setup of the complete simulation is illustrated in the following Figure 3 From the view of OMNeT++,
the simulation is a network which has a dynamic topology and is referenced as the simulated network
in the omnetpp.ini-file for configuration. The ini-file gives access to all parameters which are offered
to be configured by the included simple modules. The parameters are referred to by their hierarchical
names with the simulated network as root module. As it is possible to assign already default values for
parameters in the modules NED file, not every parameter needs to be configured in the ini-file. The
simulation consists of basically three parts.

{{< figure src="../images/implementation_simulation.jpeg" title="Architecture of the whole Simulation Scenario" numbered="true" >}}

##### Simulated Nodes

Obviously the major part of the simulation is dedicated to the nodes. They are compound modules either
from type Vehicle or RSU and have the properties as described in the previous section. The number
of nodes in the simulation can vary over simulation time and is dynamically managed by the Eclipse MOSAIC
ScenarioManager.

##### Common Communication Dependent Modules

The second part covers the modules which actually count to the communication stack, but are common
for all simulated nodes. These modules are the ChannelControl and the FlatNetworkGenerator.
The ChannelControl keeps track of all nodes, their positions and Radio Channels. The main task is to
determine which nodes are in communication range and which other nodes are within interference
distance. The FlatNetworkGenerator is part of the Network Layer. It is used to instantiate a network
with a flat topology and assigns the IP addresses to all nodes. Additionally it runs Dijstra’s shortest path
algorithm to discover the routes and adds them into the routing tables. It is assumed that the routing
tables are of kind of the RoutingTable from the specific NetworkLayer package. This is the reason why
every node is equipped with the RoutingTable submodule. This approach works out for the current
simulation purposes, but when any Ad hoc Routing protocols will be introduced to the simulation model
the FlatNetworkGenerator and the RoutingTable modules are likely be obsolete and would have to be
replaced.

##### Eclipse MOSAIC ScenarioManager

The `ScenarioManager` is an experimental feature that implements a central control instance in
simulations with INETMANET framework. It is loaded with a script in XML notation and is used to setup and control simulation experiments. Actually the original ScenarioManager and the new
Eclipse MOSAIC ScenarioManager have nearly nothing in common but the fact that both are used as a central
management instance to enhance simple configurations to simulate more sophisticated scenarios. The
general tasks of the Eclipse MOSAIC ScenarioManager contain the simulation start up with instantiation of
common modules as ChannelControl and initialization of the Eclipse MOSAIC EventScheduler (detailed later)
and the controlled simulation shut down. But most important beside these are the management of node
mobility and management of V2X communication which are triggered by Eclipse MOSAIC during simulation.

The **Mobility Management** is responsible for administration of simulated nodes and their mobility.
This includes introducing nodes to simulation, updating node positions and removing nodes from
simulation.

The node introduction method is triggered by Eclipse MOSAIC with the commands `ADD_NODES` or `ADD_RSU_NODES` respectively. It adds the node according to its node id to the managed modules and creates the complete compound module. Important for later message handling is the setup of connections to the dedicated Eclipse MOSAIC App, which is done via so called gates. At the moment, the Eclipse MOSAIC Apps are statically initialized, but the concept is suitable to be extended later when other transport protocols and in turn
applications have to be simulated.

Upon `MOVE_NODE` command, which contains the affected node id and new position to be updated, the
node is moved via the `VSimRTIMobility` {{% todo %}}Modulname anpassen{{% /todo %}} module.

At last the `REMOVE_NODE` command indicates that a node leaves the simulation. On this event, the according node is deleted and unregistered from managed modules.

The **CommunicationManagement** controls the sending and receiving of V2X messages.

The `SEND_V2X_MESSAGE` command initiates the sending process. It contains the sender node id and
the transport protocol. Thus the Eclipse MOSAIC ScenarioManager can select the according Eclipse MOSAIC app at the according node.

When a message from another node successfully arrives at the application layer the Eclipse MOSAIC ScenarioManager
is notified by the according node. Then, it sets up a `RECV_V2X_MESSAGE` which is sent back
to Eclipse MOSAIC via the Eclipse MOSAIC EventScheduler. This intermediate step is introduced, since the Eclipse MOSAIC
EventScheduler is the only instance, which is connected to Eclipse MOSAIC and which knows when it is safe to
receive and send interactions.

### Simulator Coupling

OMNeT++ is connected to Eclipse MOSAIC according to the concept of high-level-architecture (HLA). That
means that the OMNeT++ simulation program itself is encapsulated in the OMNeT++ federate. To
enable the coupling according to Eclipse MOSAIC concept, two components needed to be developed. First, the
OMNeT++ federate is extended with the customized Eclipse MOSAIC EventScheduler, which can receive and
send interactions forMobility and CommunicationManagement. The second component is the OMNeT++
Ambassador that can handle on the one hand the OMNeT++ specific connection and on the other
hand the well-defined interface to Eclipse MOSAIC. The emphasis of both components lies in the synchronized
exchange of interactions i.e. a time management mechanism must be jointly realized by them. For this
purpose the conservative synchronization mechanism is implemented. The following figure gives an overview
of the included compenents.

{{< figure src="../images/implementation_vehicle.jpeg" title="Overview of Simulator Coupling" numbered="true" >}}

##### Eclipse MOSAIC EventScheduler

The Eclipse MOSAIC EventScheduler extends the simple standard scheduler of OMNeT++ to be able to implement the time management for the Conservative Synchronization with Eclipse MOSAIC. It is the only module in OMNeT++ which has access to the event queue or Future Event Set (FES). Since the OMNeT++ simulation
is an event driven simulation the scheduler has to fulfill two tasks. The first task is the actual scheduling
part which is always invoked by the simulation kernel to schedule the next event. It allows all events from
the FES to be processed up to the granted logical time $T$. If there are only events with a later time $T'$ than
$T$ left in the FES, it sends the Next Event Request (NER) to the OMNeT++ Ambassador at Eclipse MOSAIC side and
blocks the OMNeT++ simulation. Then the second task comes into operation. If necessary, it coordinates
the Receive Interaction procedure and merges the external events from Eclipse MOSAIC and hence from other
federates to the internal FES. Events with the same time stamp are ordered to the FES according to first
come first serve mechanism. Note that the handling of these simultaneous events is generally important
to ensure repeatable execution of simulations. The decision about ordering is in control of the federate
itself, since the RTI does not sufficiently have the information to do this. After the Receive Interaction
step, the RTI completes the time management cycle with the Time Advance Grant for $T'$. At this point the
scheduler can set its logical time to $T = T'$ and unblock the further processing.

Additionally the Eclipse MOSAIC EventScheduler provides the service for other modules to send interactions back
to the OMNeT++ Ambassador, since it is also the one module which is connected to Eclipse MOSAIC. Currently,
this is used by the Eclipse MOSAIC ScenarioManager to report the `RECEIVE_V2X_MESSAGES`.

#### Eclipse MOSAIC OMNeT++ Federate Development

This section provides a description how to set up the **OMNeT++ IDE** for the Eclipse MOSAIC OMNeT++ Federate Development.

At this point it is awaited, that the [Eclipse MOSAIC OMNeT++ Federate is successfully installed](/docs/simulators/network_simulator_omnetpp).

##### Prepare OMNeT++ IDE

1. Create an empty directory somewhere inside your home directory. We will call it `<omnetpp_workspace>` from here on. This directory will be used as a workspace in your OMNeT++ IDE.
2. Open your OMNeT++ IDE by executing `omnetpp` in your terminal.
3. Select `<omnetpp_workspace>` as workspace and continue by clicking `Launch`.
4. Close the "Welcome" screen.
5. Since your workspace is empty, the OMNeT++ IDE will ask you if you want to install the INET framework and OMNeT++ programming examples.  
   {{< figure src="../images/omnetpp-ide-install-inet.png" title="OMNeT++ IDE: Install INET" numbered="true" >}}
   Decide by yourself if you want to do that:
   * By clicking `OK` the INET framework is going to be installed into an `inet` folder in your `<omnetpp_workspace>`
   * If you already have INET installed somewhere you can skip the installation and import your existing INET project:  
     1. `Cancel` the dialog.
     2. Choose `File` > `Open Projects from File System...`
     3. In the new window choose the directory of your existing INET installation as `Import Source` and click `Finish`
6. The project `inet` should now be visible in the `Project Explorer` of your OMNeT++ IDE.
7. Right-click on free space in the `Project Explorer` and choose `New` > `OMNeT++ Project...`  

   {{< figure src="../images/omnetpp-ide-new-project.png" title="OMNeT++ IDE: Create new OMNeT++ Project" numbered="true" >}}
8. In the new window: 
   1. Name the new project `federate`
   2. __Uncheck__ the box before `Use default location`, click `Browse` and select:  
   `<mosaic>/bin/fed/omnetpp/omnetpp_federate_src/src`  
   {{< figure src="../images/omnetpp-ide-new-project-2.png" title="OMNeT++ IDE: Create new OMNeT++ Project" numbered="true" >}}
   3. Click `Next`
9. On the following `Initial Contents` page select `Empty Project` and continue by clicking `Finish`  
   You should now find two projects in the `Project Explorer` of your OMNeT++ IDE: `inet` and `federate`
10. Right-click on the `federate` project and choose `Properties`
    1. Go to `Project references` and __check__ the box before `inet`  
    {{< figure src="../images/omnetpp-ide-project-references.png" title="Choose project references" numbered="true" >}}

That's it! None of the files should now be marked with an error symbol.

---

##### Configure Rebuild Configuration

Since the Eclipse MOSAIC OMNeT++ Federate is not a classic OMNeT++ project, it cannot be build regulary with
the OMNeT++ IDE by just clicking on the `Build` button. However, to make the build process easy and intuitive
we provide a simple build script and the following desciption how to configure the OMNeT++ IDE to enable 
building on a single click:

1. In the OMNeT++ IDE select `Run` > `External Tools` > `External Tools Configuration...`
2. Double-click in the left column on `Program` to create a new configuration.
3. Call it `rebuild federate`
4. In the `Main` tab:
   1. Under `Location` choose `Browse Workspace...` and select `federate/rebuild_federate.sh`
   2. Still in the `Main` tab under `Working Directory` choose `Browse Workspace...` and select `federate`
   {{< figure src="../images/omnetpp-ide-build-config.png" title="OMNeT++ IDE Build Configuration" numbered="true" >}}
5. In the `Build` tab __uncheck__ the box before `Build before launch`  
   {{< figure src="../images/omnetpp-ide-build-config-2.png" title="OMNeT++ IDE Build Configuration" numbered="true" >}}
6. Now you can `Apply` your changes and click on `Run`.  
7. Since you have built the project at least once, you can rebuild it again by clicking here:  
   {{< figure src="../images/omnetpp-ide-run-rebuild.png" title="Run rebuild" numbered="true" >}}

**The following video shows the above described steps:**

{{< video src="../images/omnetpp-ide-rebuild-federate.mp4" controls="yes" >}}

---

##### Configure Debug Configuration

To debug the Eclipse MOSAIC OMNeT++ Federate during simulation you need to create a Debug Configuration. The following
instruction will tell you how to that:

1. In your OMNeT++ IDE choose `Run` > `Debug Configurations...`
2. In the new window double-click on `OMNeT++ Simulation` in the left column and name the new created debug configuration `federate`.
3. In the `Executable` row check `other` and type `/federate/federate`
4. In the `Working dir` row type `/federate`
5. In the `Ini file(s)` row type `debug.ini omnetpp.ini`
6. At the end of the page click on the `More >>` link. And make sure all fields in the `Advanced` area are __empty__.
7. For `Projects to build` select `Do not build automatically before launch`
8. Now `Apply` your changes and try your configuration by clicking `Debug`

**The following images shows the final debug configuration:**

{{< figure src="../images/omnetpp-ide-debug-config.png" title="Final debug configuration" numbered="true" >}}

---

### The OMNeT++ Ambassador

The OMNeT++ Ambassador is the intermediate component between OMNeT++ and Eclipse MOSAIC. As it
implements the interface of an abstract federate ambassador in Eclipse MOSAIC. In the initialization phase the
Ambassador applies for the TimeManagement policies time constrained and time regulated at the RTI.
Remind that time constrained means that the time advances of the OMNeT++ Federate are dependent on
the other simulators in the federation and time regulating means that the OMNeT++ Federate itself can
prevent other federates from advancing their time.

The OMNeT++ simulation starts initially with an empty event queue and hence it needs to receive an
interaction to fill the event queue with the first events to be processed. That means that the typical time
management cycle in the Ambassador starts at step two with the Receive Interaction procedure. Note
that messages within Eclipse MOSAIC usually effect more than one interaction e.g. a VehicleUpdates interaction
contains information for added nodes and moved nodes. These are exchanged with OMNeT++ using a
simple byte protocol. After this procedure the third step of time management cycle is processed with
the initial Time Advance Grant. This is the point when the OMNeT++ simulation is able to start and the
initialization phase is finished. Hence the time management cycle can be executed from first step which
is waiting for a new NER until no federate requests further events and the simulation is finished.

### The Time Representation

One important issue for the simulation coupling is the common representation of the logical time at the
RTI and the different federates in the federation. Normally, the time is a federate-defined abstract data
type. The requirements for such a time are the ability for comparison and addition and most important
the possibility of conversion without the loss of precision. Otherwise, deadlocks in the synchronization
procedure are guaranteed. On the one hand Eclipse MOSAIC treats times as a 64-bit integer with a resolution of
nanoseconds. On the other hand the OMNeT++ simulation time is represented by the type `simtime_t`
which is a typedef to double. It is generally known that conversions from floating point to fixed point are
vulnerable to rounding errors. To circumvent this issue the underlying raw 64-bit integer of the `simtime_t`
representation is also made accessible, which works perfect if the scale exponent for time precision was
previously initialized to $-9$ (i.e. nanoseconds).
