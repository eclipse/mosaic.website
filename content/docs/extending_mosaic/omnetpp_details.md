---
title: OMNeT++ Federate Implementation
linktitle: OMNeT++ Federate
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 60
menu:
  docs:
    parent: extending_mosaic
---

The OMNeT++ Federate design is based on a microsimulation where every participating vehicle respectively
node is individually modeled and simulated and all entities are clued together in a scenario with
one instance the manages the interaction between them. That means at first the internals of one node
are introduced which incorporate mainly the communication stack and a mobility model. Afterwards,
especially the scenario management is presented which builds up on the individual nodes and controls
the major part of the simulation. These both aspects are in similar way needed for most mobile communication
simulation with OMNeT++ even in an isolated setup. However, specifically for interaction and
synchronization with the other simulators in the Eclipse MOSAIC environment, a third pillar is necessary. This
scheduler module is very important for the system as it implements the time management and event
scheduling according to Eclipse MOSAIC specific concepts.

### Node Internals

The main part of the node model consists of the communication stack. The submodules for communication
are adopted from the INET framework. All
modules are linked together to a compound module using the `NED` language. The following figure depicts the node architecture.
The concept currently supports two different
kinds of nodes for Vehicles and RSUs, while V2X-based traffic lights are treated as RSUs. For the first
approach these two kinds of nodes have the equal construction in terms of modules. The difference at the
moment is that they can be configured with different values for parameters in the `omnetpp.ini` e.g. that Vehicles and RSUs
have a different antenna height which is important for Two Ray Ground ReflectionModel.

{{< figure src="../images/implementation_vehicle.png" title="Architecture of one Node" width="600px" numbered="true" >}}

##### Communication Stack

The right part of the block diagram in the figure above depicts the communication stack. It is based on the
module `Ieee80211`, which is a compound module itself and covers the complete IEEE 802.11 network interface
card with the `MAC` and `PHY` Layer and the `Radio Channel`. The configuration of different values for
standard parameters e.g. the PHY bit rate or size of the contention window of the MAC can be exchanged
within the `omnetpp.ini`-file.

(_Please
note that the configuration allows different values for each kind of nodes and hence it is possible to
configure another propagation model or carrier frequency for Vehicles compared to RSUs. Even if
the possibility for such a configuration exists, it should be avoided and common parameters should
consistently be configured twice with the same value._)

The next module in the communication stack is the `NetworkLayer`. Once again it is a compound module
and already a collection of most important IPv4 protocols as well as the Interface- and RoutingTables.
The NetworkLayer is also the home of the Routing Protocol, which could be e.g. GPSR. Yet, at the current
status, the implementation focusses on single hop communication, meaning the NetworkLayer mainly
forwards messages for 255.255.255.255-broadcast adresses from the TransportLayer to the MAC Layer.

The `TransportLayer` of the communication stack is made up of UDP.

The module `MosaicProxyApp` of Application Layer is the entry point for application messages for the communication stack.
It is triggered by the Eclipse MOSAIC ScenarioManager 
to send new messages to lower layers and forwards received messages back to the ScenarioManager
upon reception. The main tasks are generally acting as an application within the scope of OMNeT++ and
encapsulating the message contents to packets to prepare them for sending.

##### Mobility Model

The second important component of the node is the mobility module `MosaicMobility`, which extends
the BasicMobility. Unlike other mobility models as RandomWaypoint it does not generate node movements
itself and has a straight static character. Node position updates are always triggered by the Eclipse MOSAIC
ScenarioManager. Hence,mobility is completely controlled by Eclipse MOSAIC and in turn by the coupled traffic
simulator.


### Simulation Setup

The setup of the complete simulation is illustrated in the following Figure. From the view of OMNeT++,
the simulation is a network (`Scenario.ned`), which has a dynamic topology and is referenced as the simulated network
in the omnetpp.ini-file for configuration. The ini-file gives access to all parameters which are offered
to be configured by the included simple modules. The parameters are referred to by their hierarchical
names with the simulated network as root module. As it is possible to assign already default values for
parameters in the modules NED file, not every parameter needs to be configured in the ini-file. The
simulation consists of basically three parts.

{{< figure src="../images/implementation_simulation.png" title="Architecture of the whole Simulation Scenario" width="600px" numbered="true" >}}

##### Simulated Nodes

Obviously the major part of the simulation is dedicated to the nodes. They are compound modules either
from type `Vehicle` or `RSU` and have the properties as described in the previous section. The number
of nodes in the simulation can vary over simulation time and is dynamically managed by the Eclipse MOSAIC
ScenarioManager.

##### Ieee80211ScalarRadioMedium 

The `Ieee80211ScalarRadioMedium` basically models the broadcast communication channel between the Radio Channel
sub module (in Ieee80211 Nic) for each node and thus enables the actual V2X message transmission between the nodes.

##### MosaicScenarioManager

The `MosaicScenarioManager` is used as the central
management instance to enhance simple configurations to simulate more sophisticated scenarios. The
general tasks of the MosaicScenarioManager contain the simulation start up with initialization of the
`MosaicEventScheduler` (detailed later) and controlled simulation shut down, and most important during simulation
the management of node mobility and V2X communication, which are triggered by Eclipse MOSAIC.

The **Mobility Management** is responsible for administration of simulated nodes and their mobility.
This includes introducing nodes to simulation, updating node positions and removing nodes from
simulation.

The node introduction method is triggered by Eclipse MOSAIC with the commands `ADD_NODES` or `ADD_RSU_NODES` respectively. It adds the node according to its node id to the managed modules and creates the complete compound module. Important for later message handling is the setup of connections to the dedicated Eclipse MOSAIC App, which is done via so called gates. At the moment, the Eclipse MOSAIC Apps are statically initialized, but the concept is suitable to be extended later when other transport protocols and in turn
applications have to be simulated.

Upon `MOVE_NODE` command, which contains the affected node id and new position to be updated, the
node is moved via the `MosaicMobility` module.

At last the `REMOVE_NODE` command indicates that a node leaves the simulation. On this event, the according node is deleted and unregistered from managed modules.

The **CommunicationManagement** controls the configuration of the Radio during runtime as well as the sending and receiving of V2X messages.

The `SEND_V2X_MESSAGE` command initiates the sending process. It contains the sender node id and
the transport protocol. Thus the MosaicScenarioManager can select the according Eclipse MOSAIC app at the according node.

When a message from another node successfully arrives at the ProxyApplication, the MosaicScenarioManager
is notified by the according node. Then, it sets up a `RECV_V2X_MESSAGE` which is sent back
to Eclipse MOSAIC via the MosaicEventScheduler. This intermediate step is introduced, since the MosaicEventScheduler is the only instance, which is connected to Eclipse MOSAIC and which knows when it is safe to
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

{{< figure src="../images/implementation_simcoupling.png" title="Overview of Simulator Coupling" width="450px" numbered="true" >}}

##### Eclipse MOSAIC EventScheduler

The `MosaicEventScheduler` extends the standard scheduler of OMNeT++ to be able to implement the time management for
synchronization with Eclipse MOSAIC. It is the only module in OMNeT++ which has access to the event queue or Future Event Set (FES). Since the OMNeT++ simulation
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

Additionally the `MosaicEventScheduler` provides the service for other modules to send interactions back
to the OMNeT++ Ambassador, since it is also the one module which is connected to Eclipse MOSAIC. Currently,
this is used by the Eclipse MOSAIC ScenarioManager to report the `RECEIVE_V2X_MESSAGES`.

#### Eclipse MOSAIC OMNeT++ Federate Development

This section provides a description how to set up the **OMNeT++ IDE** for the Eclipse MOSAIC OMNeT++ Federate Development.

At this point it is awaited, that the [OMNeT++ Federate](/docs/simulators/network_simulator_omnetpp) is successfully installed.

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

# The OMNeT++ Ambassador

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
