---
title: Environment Simulator
linktitle: Environment Simulator
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 100
menu:
  docs:
    parent: simulators
---

This ambassador can be configured with a configuration file. The specific path is `mosaic/scenarios/<scenarioName>/environment/environment_config.json`


```plaintext
└─ <scenario_name>
   └─ environment
      └─ environment_config.json ..................... Environment ambassador configuration file
```

### Installation

This simulator does not need to be installed. It is delivered as part of the Eclipse MOSAIC-installation package.

### Configuration

{{% alert tip %}}
Read the detailed documentation of the {{< link title="Environment Configuration" href="/docs/mosaic_configuration/environment_config/" >}}.  
{{% /alert %}}

The root node of the configuration is a list of environment events. Each event require the type of the event, a rectangle area, a 
strength and the time window. The following example shows the configuration of an "Obstacle" event which is valid in the
designated area (Rectangle) during the simulation time between 0 to 2000 seconds:

```json
{
    "events" : [
        {
            "type": {
                "sensorType": "OBSTACLE",
                "value": 1
            },
            "location": {
                "area": {
                    "type": "Rectangle",
                    "a": {
                        "latitude": 52.53654,
                        "longitude": 13.42116
                    },
                    "b": {
                        "latitude": 52.53435,
                        "longitude": 13.42366
                    }
                }
            },
            "time": {
                "start": "0 s",
                "end": "2000 s"
            }
        }
    ]
}
```