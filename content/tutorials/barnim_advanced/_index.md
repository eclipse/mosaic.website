---
title: Barnim Advanced
linktitle: barnim_advanced
toc: false
type: tutorials
draft: false
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

As mentioned in {{< link title="Barnim Basic" href="/tutorials/barnim_basic/#overview-of-applications" >}}, the Barnim
tutorial is structured in four applications.
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

In case the sensor detects an environmental hazard the vehicle sends out a DEN-message to warn
other vehicles. In the `reactOnEnvironmentData()` method, the sending is handled with 
regard to used communication network. If `WeatherWarningAppCell` is mapped, cellular communication is used, 
in case of `WeatherWarningApp` ITS-G5 communication is used as described in the [Tiergarten tutorial](/tutorials/tiergarten). 

```java
private void reactOnEnvironmentData(SensorType type, int strength) {

    GeoPoint vehiclePosition = getOperatingSystem().getPosition();

    String roadId = getOperatingSystem().getVehicleInfo().getRoadPosition().getConnection().getId();

    // reach all vehicles in a 3000m radius
    GeoCircle dest = new GeoCircle(vehiclePosition, 3000);

    MessageRouting mr;
    if (useCellNetwork()) {
        mr = getOperatingSystem().getCellModule().createMessageRouting().geoBroadCast(dest);
    } else {
        mr = getOperatingSystem().getAdHocModule().createMessageRouting().geoBroadCast(dest);
    }

    Denm denm = new Denm(mr, new DENMContent(
        getOperatingSystem().getSimulationTime(), vehiclePosition, roadId, type, strength, SPEED, 0.0f, vehiclePosition, null, null)
    );

    if (useCellNetwork()) {
        getOperatingSystem().getCellModule().sendV2XMessage(denm);
    } else {
        getOperatingSystem().getAdHocModule().sendV2XMessage(denm);
    }
}
```

Next, we look at the receiving side of the DENM here. Since the message is a simple V2X message it
is received through the `receiveV2xMessage()`-method which is part of the application interface. 
Analogous to a normal message, here we check with `instanceof`, if it is of a type that we are interested in, in
this case `Denm`. In that very case, we perform a potential route change if not already done.


```java
public void receiveV2xMessage(ReceivedV2xMessage receivedV2xMessage) {
    final V2xMessage msg = receivedV2xMessage.getMessage();
    if (!(msg instanceof Denm)) {
        return;
    }

    final Denm denm = (Denm)msg;
    if (routeChanged) {
        getLog().infoSimTime(this, "Route already changed");
    } else {
        reactUponDENMessageChangeRoute(denm);
    }
}
```

In order to calculate alternative routes to the destination and to change the actual route to the next best route, 
the method `circumnavigateAffectedRoad()` is implemented. The affected road segment is identified by the road id parameter.
The route calculation needs to be parametrized in a way, that it avoids this road segment to include in the calculation.
This is achieved by using the specific cost function `ReRouteSpecificConnectionsCostFunction` and passing it
to the `RoutingParameters` object.

```java
private void circumnavigateAffectedRoad(DENM denm, final String affectedRoadId) {

    ReRouteSpecificConnectionsCostFunction myCostFunction = new ReRouteSpecificConnectionsCostFunction();
    myCostFunction.setConnectionSpeedMS(affectedRoadId, denm.getCausedSpeed());

    INavigationModule navigationModule = getOperatingSystem().getNavigationModule();

    RoutingParameters routingParameters = new RoutingParameters().costFunction(myCostFunction);

    RoutingResponse response = navigationModule.calculateRoutes(new RoutingPosition(navigationModule.getTargetPosition()), routingParameters);

    CandidateRoute newRoute = response.getBestRoute();
    if (newRoute != null) {
        getLog().infoSimTime(this, "Sending Change Route Command at position: {}", denm.getSenderPosition());
        navigationModule.switchRoute(newRoute);
    }
}
```

## WeatherWarningAppCell

The only difference of the WeatherWarningAppCell to detailed described WeatherWarningApp is that the 
`WeatherWarningAppCell`-application enabled the use of the cellular network. 

## SlowDownApp

The `SlowDownApp` induces a speed reduction as soon as the on-board sensors detect hazardous conditions.
To detect the change in the on-board sensors, the state of the sensors have to be queried whenever the
vehicle has moved. This is achieved by implementing the `onVehicleUpdated()` method which is called
whenever the traffic simulator executed one simulation step. 

In this specific implementation, the speed of the vehicle is reduced to *25 km/h* within the entire hazardous area. 
After leaving the hazardous area, the vehicles returns to their original speed again:

```java
public void onVehicleUpdated(VehicleData previousVehicleData, VehicleData updatedVehicleData) {
    
    SensorType[] types = SensorType.values();
    int strength = 0;

    for (SensorType currentType : types) {
        strength = getOs().getStateOfEnvironmentSensor(currentType);

        if (strength > 0) {
            break;
        }
    }

    if (strength > 0 && !hazardousArea) {
        getOs().changeSpeedWithInterval(SPEED, 5000);
        hazardousArea = true;
    }

    if (strength == 0 && hazardousArea) {
        getOs().resetSpeed();
        hazardousArea = false;
    }
}
```
