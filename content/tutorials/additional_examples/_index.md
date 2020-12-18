---
title:
linktitle:
toc: false
type: tutorials
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  tutorials:
    parent: additional_examples
    weight: 8
---

# Additional Examples

These examples are mostly ready-to-go applications that demonstrate how to write an application and how to use some features provided by Eclipse MOSAIC for broad development goals spectrum.
We list them in the specific order that we're recommending to follow if you start to develop MOSAIC application.

## Learning Objectives:

* [x] Use of various Eclipse MOSAIC components.
* [x] Development of Eclipse MOSAIC applications.
* [x] Inter-app and inter-unit communication.
* [x] How to send and receive specific messages.
* [x] Combination of different Eclipse MOSAIC modules.

### Event processing

#### Learning Objectives: 
* [x] Creating and handling of specific events.
* [x] Use of specific and random intervals for created events.

`HelloWorldApp` - Inheritance from AbstractApplication with a certain OS, learning about the needed methods you have to implement, events creating and adding, getting the logged messages. 
Additional learning objectives: First handling of mapping_config (application-to-vehicle mapping).

`IntervalSamplingApp` - Sampling interval control: Setting an offset for the beginning of sampling (different vehicles get different offsets), which allows a better understanding of processEvent() methods call loop, and setting the interval duration. 

`RandomSamplingIntervalApp` - Setting a random sampling interval duration (approaches a real world traffic situation). 

`MultithreadSamplingApp` - Demonstrates how vehicles can do some calculations parallel to RTI and therefore to each other. 

`SpecificEventProcessingApp` - Creating own events through the assignment of event processing to an own method.

### Vehicle specific application

#### Learning Objectives: 
* [x] Implement of the VehicleApplication interface.
* [x] Use of the VehicleApplication methods to equip the simulation unit with different behaviour.

`OnUpdateVehicleInfoApp` - VehicleApplication interface methods overview and usage. Understanding of these methods dependency from simulation update interval. 

### Inter app communication (Intra unit)

#### Learning Objectives: 
* [x] Data exchange and processing between different applications.

`InterconnectApp` - Event scheduling for other applications that are assigned to the same unit and therefore a possibility to send messages between them.   

`AdditionalProcessingApp` - This application is used *only as an addition* to the InterconnectApp, showing processing of events that were created and added to EventManager for this application by InterconnectApp and therefore being able to receive a message from Events resource.  

`NotProcessingApp` - This application is used *only as an addition* to the InterconnectApp. It doesn't implement processEvent method, thus not being able to receive the message that is sent from InterconnectApp.

### Inter unit communication

#### Learning Objectives: 
* [x] Creating specific V2X-messages.
* [x] Communication between simulation units.
* [x] Message transmission and respond to incoming messages.

`MosaicInteractionHandlingApp` - Message sending from a unit to other units (to all others or to the certain ones, creation of and reaction on the ApplicationSpecificMessage.  

`AdditionalReceivingApp` - This application is used *only as an additional demonstration* of MosaicInteractionHandlingApp's work. It receives MyMessage (inherits from ApplicationSpecificMessage) sent by MosaicInteractionHandlingApp and logs its content.  

`MyMessage` - Message example. 

###  Other applications

#### Learning Objectives:
* [x] Implementation of various V2X applications.
* [x] Learn the structure of the configuration files and equip the simulation units with applications.
* [x] Learn the difference between Ad-hoc and cellular communication.

`VehicleConfigurationApp` - Json configuration file structure. Different vehicles that are equipped with the same application can be configured differently. Usage of the read configuration.

`CamSendingApp` - Sending CAMs (Cooperative Awareness Messages) with additional information that can be defined by user. Difference between usage of different modules: Cell and Ad-hoc. 

`UserTaggedValueReadingApp` - Reaction on the received V2X messages, reading the sent User Tagged value.

`SumoTraciIntercationApp` - Direct communication with SUMO using TraCI (sending messages to TraCI and reacting on its response). 

