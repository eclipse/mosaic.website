---
title: 3D Visualization (PHABMap)
linktitle: PHABMap
toc: false
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
menu:
  docs:
    parent: visualization
    weight: 4
---

{{% alert note %}}
The 3D Visualization is only available with a commercial license of MOSAIC Extended. For further information on licences, please refer to our mailing list.
{{% /alert %}}

The Eclipse MOSAIC 3D Visualization Tool is based on the PHABMACS vehicle simulator and uses the same 3D
engine and models to visualize vehicle movements and various events which occur during the simulation.
Next to the road network, which can be optionally rendered by the visualizer, the following units and
events are visualized:

* Vehicle movements coming from the traffic simulation
* Road Side Units at their defined location
* V2X-messages sent via cellular communication (indicated as green circles)
* V2X-messages sent via ITS-G5 communication (indicated as blue circles)
* V2X-messages received by vehicles (indicated as red circles)

{{< figure src="../images/phabmap.jpg" title="The 3D visualization tool PHABMap displaying events from the simulation" numbered="true" >}}
