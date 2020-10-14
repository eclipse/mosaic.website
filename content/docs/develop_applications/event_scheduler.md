---
title: Event Scheduling
linktitle: Event Scheduling
toc: true
type: docs
date: "2019-08-11"
draft: false
weight: 4
menu:
  docs:
    parent: develop_applications
    weight: 4
---

The different modules of the [Eclipse MOSAIC Application Simulator](/docs/simulators/application_simulator/#eclipse-mosaic-application-simulator) communicate over events that are triggered at a specific simulation time. The following classes and interfaces model theses events.

### Event
The class `Event` contains the information that is necessary to process an event. An event describes when it should be processed and which information is processed. Moreover an event has an assigned priority.

#### Attributes of Event
The class Event contains the following attributes:
* `long time`: defines the time when the execution of the event is triggered.
* `long nice`: defines the priority of the event. When multiple events are scheduled for the sametime, the events are ordered in ascending order.
* `List<EventProcessor> processors`: is a list of components that shall process the event.
* `Object resource`: is an object that contains additional information designated for the processor of the event. The resource can be any object.

#### Methods of Event
* `Event()`: There are multiple constructors for Event with different parameters. Every constructor sets default values for the attributes that are not defined by the arguments of the constructor.
* `Event newTime(long time)`: allows the creation of a new event with a new execution time based
* `String getResourceSimpleClassName()`: returns the class name of the resource as String.
* `int compareTo(Event event)`: implements the standardized Java interface [Comparable](https://docs.oracle.com/javase/8/docs/api/java/lang/Comparable.html).  Toorder the events, first the time of the event is evaluated. In case the times are equal, the priority of the events is compared.

### Interface EventManager
The interface `EventManager` defines the method `void addEvent(Event event)` that needs to be implemented to add an event to the execution.

### Interface EventScheduler
The interface `EventScheduler` extends the interface `EventManager` and is used for classes that trigger events.

#### Methods of EventScheduler
* `boolean isEmpty()`: returns true if the scheduler contains no elements, otherwise it returns false.
* `long getNextEventTime()`: returns the time of the next event.
* `long getScheduledTime()`: returns the time when the last event has been executed.
* `List<Event> scheduleEvents(long time)`: returns a list of objects that are scheduled for a
certain simulation time.
* `Set<Event> getAllEvents()`: returns a set of all events that are considered by the scheduler.

### EventSchedulerImpl
The class `EventSchedulerImpl` is an implementation of the interface `EventScheduler`.

### Interface EventProcessor
The interface `EventProcessor` defines how the execution module gets the events. The execution module
therefore has to implement the following methods:
* `void processEvent(Event event)`: The module processes the event.
* `boolean canProcessEvent()`: returns true when the module is currently able to process new
events, otherwise it returns false.

### InterceptedEvent
### Class EventInterceptor
In some situation it is useful to intercept events before they actually reach the intended processors. By
intercepting the events it is possible to apply further monitoring and to filter which events the event
processors receive. The class `EventInterceptor` is used to construct objects of the type `InterceptedEvent`.
In the constructor it is possible to specify an EventManager that manages the intercepted events. Moreover, objects of the type `EventProcessor` can be specified that shall process the intercepted events.

### Class InterceptedEvent
The class `InterceptedEvents` extends the class Event. It is used to provide type safe allocations of
events that shall be intercepted.
