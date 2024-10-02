---
title: Additional Examples
linktitle: additional_examples
toc: false
type: tutorials
draft: false
pagination_prev: traffic_management
---

These examples are mostly ready-to-go applications that demonstrate how to write an application and how to use some features provided by Eclipse MOSAIC for broad development goals spectrum.
We list them in the specific order that we're recommending to follow if you start to develop MOSAIC application.

With this tutorial you learn more about the following objectives:
- [Event Processing](#event-processing)
- [Vehicle Specific Application](#vehicle-specific-application)
- [Inter App Communication](#inter-app-communication-intra-unit)
- [Inter Unit Communication](#inter-unit-communication)
- [Further Applications](#further-applications)

### Event Processing

{{% alert learning_objectives %}}
- Creating and handling of specific events.
- Use of specific and random intervals for created events.
{{% /alert %}}

| Application                  | Description |
|------------------------------|-------------|
| `HelloWorldApp`              | Inheritance from AbstractApplication with a certain OS, learning about the needed methods you have to implement, events creating and adding, getting the logged messages. Additional learning objectives: First handling of mapping_config (application-to-vehicle mapping). |
| `IntervalSamplingApp`        | Sampling interval control: Setting an offset for the beginning of sampling (different vehicles get different offsets), which allows a better understanding of processEvent() methods call loop, and setting the interval duration. |
| `RandomSamplingIntervalApp`  | Setting a random sampling interval duration (approaches a real world traffic situation). |
| `MultithreadSamplingApp`     | Demonstrates how vehicles can do some calculations parallel to RTI and therefore to each other. |
| `SpecificEventProcessingApp` | Creating own events through the assignment of event processing to an own method. |

### Vehicle Specific Application

{{% alert learning_objectives %}}
- Implement of the VehicleApplication interface.
- Use of the VehicleApplication methods to equip the simulation unit with different behaviour. 
{{% /alert %}}

| Application              | Description                                                                                                                                |
|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| `OnUpdateVehicleInfoApp` | VehicleApplication interface methods overview and usage. Understanding of these methods dependency from simulation update interval.        |
| `PerceptionApp`          | This application showcases the functionalities of the [perception module and perception modifiers](/docs/develop_applications/perception). |

### Inter App Communication (Intra unit)

{{% alert learning_objectives %}} 
- Data exchange and processing between different applications.
{{% /alert %}}

| Application               | Description |
|---------------------------|-------------|
| `InterconnectApp`         | Event scheduling for other applications that are assigned to the same unit and therefore a possibility to send messages between them. |
| `AdditionalProcessingApp` | This application is used *only as an addition* to the InterconnectApp, showing processing of events that were created and added to EventManager for this application by InterconnectApp and therefore being able to receive a message from Events resource. |  
| `NotProcessingApp`        | This application is used *only as an addition* to the InterconnectApp. It doesn't implement processEvent method, thus not being able to receive the message that is sent from InterconnectApp. |

### Inter Unit Communication

{{% alert learning_objectives %}}
- Creating specific V2X-messages.
- Communication between simulation units.
- Message transmission and respond to incoming messages.
{{% /alert %}}

| Application                    | Description |
|--------------------------------|-------------|
| `MosaicInteractionHandlingApp` | Message sending from a unit to other units (to all others or to the certain ones, creation of and reaction on the ApplicationSpecificMessage. |
| `AdditionalReceivingApp`       | This application is used *only as an additional demonstration* of MosaicInteractionHandlingApp's work. It receives MyInteraction (inherits from ApplicationSpecificMessage) sent by MosaicInteractionHandlingApp and logs its content. |
| `MyInteraction`                    | Message example. | 

###  Further Applications

{{% alert learning_objectives %}}
- Implementation of various V2X applications.
- Learn the structure of the configuration files and equip the simulation units with applications.
- Learn the difference between Ad-hoc and cellular communication.
{{% /alert %}}
- Learn how to create and handle events.

| Application                 | Description |
|-----------------------------|-------------|
| `VehicleConfigurationApp`   | Json configuration file structure. Different vehicles that are equipped with the same application can be configured differently. Usage of the read configuration. |
| `CamSendingApp`             | Sending CAMs (Cooperative Awareness Messages) with additional information that can be defined by user. Difference between usage of different modules: Cell and Ad-hoc. | 
| `UserTaggedValueReadingApp` | Reaction on the received V2X messages, reading the sent User Tagged value. |
| `SumoTraciIntercationApp`   | Direct communication with SUMO using TraCI (sending messages to TraCI and reacting on its response). | 
| `SimpleCommuterApp` | Simulates the behaviour of a commuting vehicle. After reaching the goal position and resting for a specified amount of time the app will trigger a DriveBackEvent, which causes the vehicle to reroute back to the start position. |
| `EmergencyBrakeApp` | Performs an emergency brake in case an obstacle is detected by the vehicle's obstacle senors. Additionally the emergency brake detection will send out a DENM (Decentralized Environmental Notification Message) in case an emergency brake is performed. |
