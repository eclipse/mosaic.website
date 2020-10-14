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
We list them in the specific order that we recommend to follow if you are an unexperienced Eclipse MOSAIC developer. However, this is not an obligation and you can find a needed application example by looking at learning objectives or application group headers.

## Learning Objectives:

* Use of various Eclipse MOSAIC components.
* Development of Eclipse MOSAIC applications.
* Inter app and inter unit communication.
* How to send and receive specific messages.
* Combination of different Eclipse MOSAIC modules.

### Event processing

#### Learning Objectives: 
* Creating and handling of specific events.
* Use of specific and random intervals for created events.

`HelloWorldApp` - Inheritance from AbstractApplication with a certain OS, learning about the needed methods you have to implement, events creating and adding, getting the logged messages. 
Additional learning objectives: First handling of mapping_config (application-to-vehicle mapping).

`IntervalSamplingApp` - Sampling interval control: Setting an offset for the beginning of sampling (different vehicles get different offsets), which allows a better understanding of processEvent() methods call loop, and setting the interval duration. 

`RandomSamplingIntervalApp` - Setting a random sampling interval duration (approaches a real world traffic situation). 

`MultithreadSamplingApp` - Demonstrates how vehicles can do some calculations parallel to RTI and therefore to each other. 

`SpecificEventProcessingApp` - Creating own events through the assignment of event processing to an own method.

### Vehicle specific application

#### Learning Objectives: 
* Implement of the VehicleApplication interface.
* Use of the VehicleApplication methods to equip the simulation unit with different behaviour.

`OnUpdateVehicleInfoApp` - VehicleApplication interface methods overview and usage. Understanding of these methods dependency from simulation update interval. 

### Inter app communication (Intra unit)

#### Learning Objectives: 
* Data exchange and processing between different applications.

`InterconnectApp` - Event scheduling for other applications that are assigned to the same unit and therefore a possibility to send messages between them.   

`AdditionalProcessingApp` - This application is used *only as an addition* to the InterconnectApp, showing processing of events that were created and added to EventManager for this application by InterconnectApp and therefore being able to receive a message from Events resource.  

`NotProcessingApp` - This application is used *only as an addition* to the InterconnectApp. It doesn't implement processEvent method, thus not being able to receive the message that is sent from InterconnectApp.

### Inter unit communication

#### Learning Objectives: 
* Creating specific V2X-messages.
* Communication between simulation units.
* Message transmission and respond to incoming messages.

`VSimRTIMessageHandlingApp` - Message sending from a unit to other units (to all others or to the certain ones, creation of and reaction on the ApplicationSpecificMessage.  

`AdditionalReceivingApp` - This application is used *only as an additional demonstration* of VSimRTIMessageHandlingApp's work. It receives MyMessage (inherits from ApplicationSpecificMessage) sent by VSimRTIMessageHandlingApp and logs its content.  

`MyMessage` - Message example. 

###  Other applications

#### Learning Objectives:
* Implementation of various V2X applications.
* Learn the structure of the configuration files and equip the simulation units with applications.
* Learn the difference between Ad-hoc and cellular communication.

`VehicleConfigurationApp` - Json configuration file structure. Different vehicles that are equipped with the same application can be configured differently. Usage of the read configuration.

`TrafficLightControlApp` - *Traffic light control and communication is currently under refactoring.* {{% todo %}}Add a description when it is ready{{% /todo %}}

`CAMSendingApp` - Sending CAMs (Cooperative Awareness Messages) with an additional information that can be defined by user. Difference between usage of different modules: Cell and Ad-hoc. 

`UserTaggedValueReadingApp` - Reaction on the received V2X messages, reading the sent User Tagged value.

`SumoTraciIntercationApp` - Direct communication with SUMO using TraCI (sending messages to TraCI and reacting on its response). 

