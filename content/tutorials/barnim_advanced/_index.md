---
title: Barnim Advanced
linktitle:
toc: false
type: tutorials
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  tutorials:
    parent: barnim_advanced
    weight: 1
---

{{% alert note %}}
All files you need for this tutorial are included in the Eclipse MOSAIC zip file:  
**{{< link title="Download Eclipse MOSAIC" href="/download" >}}**
{{% /alert %}}

The **Barnim Advanced** tutorial extends the preceding tutorial and focuses on the implementation of applications
used in the Barnim scenario. In this section, the actual source code used to create the applications is explained, 
 giving a first impression on the API of the **Eclipse MOSAIC Application** simulator. After completing this tutorial you will be able to:

* Define an arbitrary geographical area (e.g. circular, rectangular) and allow broadcast communication in this defined area.
* Use and react to DENMs (Decentralized Environmental Notification Message), respectively create a specific message according to the requirements.
* Transmit and receive V2X-messages periodically or on request depending on the network type and communication mode (e.g. Topocast, Geocbroadcast, etc.). 
* Calculating of alternative routes to the destination to circumnavigate a road obstacle.

As mentioned in [Barnim Basic](/tutorials/barnim_basic/#overview-of-applications), the Barnim tutorial is structured in four applications.
1. `WeatherServer` - Broadcasts information about bad road conditions via cellular communication.
2. `WeatherWarningApp` - Detects bad road conditions, broadcasts information via ITS-G5, circumnavigates areas with bad road conditions.
3. `WeatherWarningAppCell`- Receives messages from `WeatherServer`, circumnavigates areas with bad road conditions.
4. `SlowDownApp` - Models driver behavior by slowing the vehicle down as soon as it enters an affected road segment.

### WeatherServer Application

Basically, the `WeatherServer` is an enhanced RSU which has knowledge about the hazardous area and it is responsible to 
transmit DEN-Messages periodically to vehicles equipped with  `WeatherWarningAppCell`-application via cellular communication. 
Firstly, the hazardous area (Road-ID and GeoPoint coordinates), the type of the warning (Sensor type), message interval 
and the resulted speed will be defined to be used later: 

```java
private final static long INTERVAL = 2 * TIME.SECOND;

private final static GeoPoint HAZARD_LOCATION = GeoPoint.latlon(52.633047, 13.565314);

private final static String HAZARD_ROAD = "-3366_2026362940_1313885502";

private final static SensorType SENSOR_TYPE = SensorType.Ice;

private final static float SPEED = 25 / 3.6f;
```

During the initialization procedure of communicating applications, the communication module (CellModule) needs to be 
activated. This is achieved in the `onStartup()`-method. The following code snipped shows the activating the 
CellModule as communication mode:

```java
public void onStartup() {
	getLog().infoSimTime(this, "Initialize WeatherServer application");
	getOperatingSystem().getCellModule().enable();
	getLog().infoSimTime(this, "Activated Cell Module");
	sample();
}
```

A DENM will be transmitted in **2s** intervals (as configured above) to the vehicles equipped with cellular 
communication within reach as an event;

```java
private void sample() {
	final Denm denm = constructDenm();

	getOperatingSystem().getCellModule().sendV2xMessage(denm);

	getLog().infoSimTime(this, "Sent DENM");

	getOperatingSystem().getEventManager().addEvent(new Event(getOperatingSystem().getSimulationTime() + INTERVAL, this));
}
```

The `Event` created in this method is passed with a `this` argument, which represents an `EventProcessor` which gets notified 
as soon as the proposed event time is reached. As this class implements the `EventProcessor` interface, the method 
`processEvent()` will be called by the application simulator ons the simulation time is reached:

```java
@Override
public void processEvent(Event event) throws Exception {
	sample();
}
```

Finally, in the method `contructDenm`, the necessary data will be added to a message container `DenmContent` and we create 
a circular area for the rerouting (3000 m) of the DEN-Message as Broadcast. All vehicles within this area which
have the cellular module activated, will receive this message. 

```java
private Denm constructDenm() {
	final GeoCircle geoCircle = new GeoCircle(HAZARD_LOCATION, 3000.0D);
	final MessageRouting routing = getOperatingSystem().getCellModule().createMessageRouting().geoBroadCast(geoCircle);

	final int strength = getOperatingSystem().getStateOfEnvironmentSensor(SENSOR_TYPE);

	return new Denm(routing,
			new DenmContent(
					getOperatingSystem().getSimulationTime(),
					getOs().getInitialPosition(),
					HAZARD_ROAD,
					SENSOR_TYPE,
					strength,
					SPEED,
					0.0f,
					HAZARD_LOCATION,
					null,
					null
			)
	);
}
```

## WeatherWarningApp 

The WeatherWarningApp application illustrates the vehicles and their behaviour in particular with regard to the 
detecting hazardous area, the receiving and sending messages. We will also cover how alternative routes 
will be calculated and how the change the route in order to circumnavigate the affected road area.

The simulating vehicles can be operated as Cellular or Ad-hoc equipped. Accordingly, the kind of used communication 
network will be activated in the `onStartup()` method as following:

```java
public void onStartup() {
	getLog().infoSimTime(this, "Initialize application");
	if (useCellNetwork()) {
		getOperatingSystem().getCellModule().enable();
		getLog().infoSimTime(this, "Activated Cell Module");
	} else {
		getOperatingSystem().getAdHocModule().enable(new AdHocModuleConfiguration()
			.addRadio()
				.channel(AdHocChannel.CCH)
				.power(50)
				.create());
		getLog().infoSimTime(this, "Activated AdHoc Module");
	}

	getOperatingSystem().requestVehicleParametersUpdate()
			.changeColor(Color.RED)
			.apply();
}
```
