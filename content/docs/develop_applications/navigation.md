---
title: Navigation in Applications
linktitle: Navigation
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 50
menu:
    docs:
        parent: develop_applications
        weight: 50
---

The navigation of vehicles (i.e. calculation of routes) is handled completely by the [Application Simulator](/docs/simulators/application_simulator#eclipse-mosaic-application-simulator). Each vehicle is equipped
with a navigation system which provides all required information and functions for navigational purposes:

* Retrieve the current position and heading of the vehicle.
* Get the target of the vehicle.
* Calculate various routes from the current position to an arbitrary target.
* Choose a suitable route out of existing ones from the current position to an arbitrary target.
* Switch onto a specific route.

In order to provide routing functionality, a map model based on Open Street Map data is used, which
needs to be transformed before the simulation using scenario-convert (see [Create a new Scenario](/docs/scenarios/scenario_convert)).
The map data including initial routes for vehicles is provided with the database file which needs to be located in
`mosaic/scenarios/<scenario_name>/application/<scenario_name>.db`. Further information about the database can be found in the [scenario database](/docs/develop_applications/scenario_database) documentation.  

To enable non-moving entities (i.e. RSUs, Servers, ...) to access routing capabilities the `IRoutingModule` can be implemented
which omits operations like route switching.

## Configuration
If the database needs to be located somewhere else, the path can be specified in
`mosaic/scenarios/<scenario_name>/application/application_config.json`:

```json
{
    ...
    "navigationConfiguration": {
        "databaseFile": "path/to/scenario.db"
    }
}
```
{{% alert note %}}
Note: Different from other modules bundled with the application simulator the navigation module doesn't need to be explicitly enabled.
{{% /alert %}}

## Usage
The following snippet shows, how the navigation system can be used within an application:

```java
//get navigation module
INavigationModule navigationModule = getOs().getNavigationModule();

//choose current target as target position
RoutingPosition targetPosition = new RoutingPosition(navigationModule.getTargetPosition());

//set routing parameters to fastest route search
RoutingParameters params = new RoutingParameters().costFunction(IRoutingCostFunction.Fastest);

//calculate routes
RoutingResponse response = navigationModule.calculateRoutes(targetPosition, params);

//switch to best route
if (response.getBestRoute() != null) {
    boolean routeSwitched = navigationModule.switchRoute(response.getBestRoute());
    ...
}
```
