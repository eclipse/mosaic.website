---
title: Event Scheduling
linktitle: Event Scheduling
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 20
menu:
    docs:
        parent: develop_applications
        weight: 20
---

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

## Trigger Own Events

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