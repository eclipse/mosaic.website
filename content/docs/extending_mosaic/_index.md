---
title: Core Concepts
linktitle: Core Concepts
toc: true
type: docs
date: "2019-08-06"
draft: false
menu:
  docs:
    parent: extending_mosaic
    weight: 1
---

To run a simulation, a federation of simulators has to be created. This federation consists of one federate
for each participating simulator. In the upper part of Figure 1, the inner structure of a federate is
illustrated. It consists of the original simulator that is connected to its federate ambassador and an
instance of an Eclipse MOSAIC ambassador. The federates run on top of the Eclipse MOSAIC Runtime Infrastructure
(lower part of Figure 1) which offers services for federation-, interaction- and time management. The
communication between the federates and the runtime infrastructure is enabled by ambassadors. More
precisely, a federate that wants to access services of the RTI can use a designated RTI-Ambassador that
provides access to the provided services. In the opposite direction, i.e. if the runtime infrastructure wants
to invoke operations on the federate implementation, a federate ambassador is used. Each federate
ambassador implements the same interface that is used by Eclipse MOSAIC to control the simulator and to
provide interactions from other federates.

{{< figure src="images/common-architecture.jpeg" title="Schematic illustration of Eclipse MOSAIC Runtime Infrastructure" numbered="true" >}}

---

## Time Management

The main problem in executing a federation is the synchronization of its federates. Each federate is a
discrete-event simulator with an ordered event list from which sequentially the first event is processed.
Consequently, the Time Management is necessary for coordinating the simulation and synchronizing
participating federates. It assures that each federate processes its events in correct order.

According to [Fujimoto](https://ieeexplore.ieee.org/abstract/document/977259) the time management in a federated environment includes two key components:
Interaction (Message) order and time stamps. Note that we usually use the word 'intercation' when
talking about communication between federates, 'message' will be used in the context of (V2X)-communication. 

The Interaction Order service is completely implemented in Eclipse MOSAIC with the following design rationale:
Each request of a federate to execute a local event is mapped to a global event within the Time management.
Such an event consists of three attributes: simulation time, priority, and lookahead time. The
simulation time defines the time in the simulation at which the event has to be processed. The priority
allows defining an order of events that are scheduled at the same time. The third attribute, the lookahead
time, describes an idle period following after an event. It is used to signalize that no further event will be
scheduled and no interaction will be sent within this period. All events are scheduled by storing them in an
event list in ascending order according to their simulation time. In case of equal simulation times, they
are ordered in descending order to their priority.
A time management cycle consists of three steps.

1. The federate invokes a time management service to request its logical time to advance.
While Time Advance Request (TAR) is more suitable for time-stepped simulators, 
Next Event Request (NER) is the preferred primitive for event-driven federates.

2. The RTI delivers certain interactions to the federate. Each federate receives the interactions 
in the `processInteraction()` method.

3. The RTI completes the cycle by invoking a federate defined procedure called Time Advance Grant 
to indicate the federate’s logical time has been advanced. Eclipse MOSAIC supports the sequential and 
the parallel conservative mechanism for advancing time.

---

## Interaction Management

The exchange of data among federates is offered by the Interaction Management using interactions. Eclipse MOSAIC and its federates are decoupled through a publish-subscribe paradigm provided by the Interaction Management.
A published interaction is forwarded to each subscriber directly after it has been
published. However, a receiving federate is not allowed to advance its time based on an interaction but must
request a time advancement if necessary. An interaction consists of its creation time, an identifier describing
its type, and optional data. Interactions to exchange traffic, network, vehicle, and sensor data are predefined.
These interactions are used to define a standardized communication behaviour.

#### Subscribe Interaction

Before a federate can receive interactions, it has to subscribe to them. The Interaction Management offers
two different ways to subscribe to certain interactions. A federate can either define a interaction type only to
receive all interactions of this type or, additionally, define conditions to filter interactions by their content. If a
federate is not longer interested in subscribed interactions, it can rescind its interest.

#### Publish Interaction

Each federate is allowed to publish any interaction at any valid time of the simulation. After a interaction is
published, the Interaction Management forwards the interaction to each federate that has subscribed to
this type of interaction. A federate receiving a interaction can ignore it or request to advance its local time to
handle this interaction.

---

## Federation Management

The Federation Management is responsible for the administration of participating federates. This includes
deploying, starting, stopping, and undeploying federates in a distributed system. Before running a
simulation, the Federation Management creates an empty federation. After that, federates join the
federation. Already joined federates can be removed from a federation, if they are not necessary for the
rest of the simulation. After a simulation is finished, the Federation Management frees used resources.

#### Create Federation

Creates an empty federation. After a federation is created, it is possible to join federates.

#### Join Federation
A joining simulator is defined by a unique name and a FederateHandle. This handle contains the information whether start-up and deployment of the simulator are required to be handled by the Federation
Management. In this case, further deployment and start-up information are included.

#### Stop Federation

After a simulation is finished, all joined federates are resigned and their used resources are freed. All
references are removed and necessary tasks to stop and undeploy the federate are executed.

### Implementation Details

When a simulator is about to join a federation, a FederateHandle is passed to the Federation Manage-
ment. A handle includes a Federate Ambassador that is responsible for all communication with the RTI
as well as all identifiers for interactions it wants to subscribe to. Additionally, it contains two flags indicating
how the simulator is started and if the simulator needs to be deployed by the Federation Management.
For the deployment, the handle consists a reference to the directory including all binaries and host
parameters consisting of an address and a directory in which the simulator shall be deployed. To start a
simulator a start-command is included.

If the simulator is running, its ambassador is registered for coordinating the simulator during the sim-
ulation run. Afterwards, the Federation Management initiates the subscription to interactions on behalf
of an ambassador. Otherwise, before the ambassador is registered, the Federation Management starts
and, if necessary, deploys the simulator on a local or a remote machine and connects it to its ambassador.
The connection is created by redirecting the output of the started simulator to its ambassador. Based on
the incoming data, the Federate Ambassador is responsible for configuring its communication with the
simulator.

### Local Federation Management

In case a simulator is to be deployed on a local machine, its binaries are copied into the simulation
directory that is defined within the host parameters. Afterwards, using the start-command the simulator
is started in a new process and its output is redirected to the ambassador. Additionally, a mapping between
ambassador and process reference is stored. Finally, when the federate is resigned, the ambassador is
called to shut down its corresponding simulator. Finally, the mapped process is killed and all copied files
are removed.

### Distributed Federation Management

To administrate simulators on remote hosts, the Federation Management uses the [Secure Shell (SSH)](https://www.ssh.com/ssh/)
protocol to send commands and the associated [Secure File Transfer Protocol (SFTP)](https://www.ssh.com/ssh/sftp/) to transfer binaries.
After a process is started remotely, a mapping between ambassador, its process id, and the host on which
is running are stored. Finally, when the federate is resigned, the remotely running process is killed and all
binaries are removed.
