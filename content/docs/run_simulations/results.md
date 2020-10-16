---
title: Simulation Results
linktitle: Simulation Results
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 20
menu:
  docs:
    parent: run_simulations
---

Eclipse MOSAIC generates log files for each simulation run. Log files are generated for the ambassadors of each
coupled federate respectively simulator and for the RTI itself. The log files are stored in the 
folder `<mosaic-root>/logs/log-<timestamp>`. For each simulation run a new folder is created.

```FOLDER
└─ log-<timestamp>
   ├─ apps
   |  ├─ <unitType>_<unitId> ................. Detailed application specific logs for each unit
   |  ├─ OperatingSystem.log ................. Detailed operating system logs for the unit
   |  └─ ExampleApp.log ...................... Detailed application specific logs for each application.
   ├─ activities.csv ......................... Simulation details in comma separated value-format
   ├─ Application.log  ....................... Information about the application ambassador
   ├─ Cell.log ............................... Cellular network log
   ├─ ChargingStation.log .................... ChargingStation ambassador log
   ├─ Communication.log ...................... (Ad hoc) network simulation ambassador log
   ├─ CommunicationDetails.log ............... Detailed output of network simulator (ns-3 or OMNeT++)
   ├─ Environment.log ........................ Logs of the environmental eventserver
   ├─ Mapping.log ............................ Mapping configuration logs
   ├─ MOSAIC.log ............................. General information, e.g. startup sequence information
   ├─ Navigation.log ......................... Detailed logs about navigation component in the application ambassador
   ├─ Traffic.log ............................ Traffic simulation log (SUMO or others)
   └─ visualizer.csv ......................... Recorded data of the integrated File Output Generator
```

In addition to standard logging output for each federate there is a `activities.csv` file which contains
detailed information about sent and received interactions. This file can be used to trace a
simulation run for deep debugging. To enable this feature, the log level of the logger `activities` has to be 
set to `INFO` in the `logback.xml` (see section below). 

## Logging

The main configuration file for logging is `<mosaic-root>/etc/logback.xml`. In this file, the log output 
can be configured in great detail. This file can be adjusted to your needs, e.g. you can set up a more detailed logging
for communication components but set a less verbose output for Eclipse MOSAIC's internal interactions or traffic
simulation depending on your simulation focus.

Eclipse MOSAIC uses *LOGback* as logging framework. *LOGback* offers a lot of parameters to adapt the output to your needs. Please refer to 
[this site](https://logback.qos.ch/manual/layouts.html#ClassicPatternLayout) for a detailed overview of all
parameters you can use in the `logback.xml` file.

Please note that you can adjust the output to your needs by setting different log levels (`ERROR`, `INFO`,
`DEBUG` etc.) for each component in the file at `<mosaic-root>/etc/logback.xml`. This might also influence
the simulation performance because of a possibly high amount of data to be logged.

### Federate specific logging

Depending on the simulation purpose, further configuration possibilities for federate specific logging
may be of interest.

For instance, OMNeT++ exhibits an elaborated logging concept. The `omnetpp.ini` in the scenario folder
includes options to adjust the logging levels. The outputs of this federate are written to `CommunicationDetails.log`.