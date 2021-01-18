---
title: Variable Message Signs Simulator
linktitle: VMS Simulator
toc: true
type: docs
draft: false
weight: 120
menu:
  docs:
    parent: simulators
---

{{% alert extended %}}
The **VMS Simulator** is part of **{{< link title="MOSAIC Extended" href="/download#overview" >}}**.  
For further information on licenses, feel free to contact us via **[mosaic@fokus.fraunhofer.de](mailto:mosaic@fokus.fraunhofer.de)**.
{{% /alert %}}

The VMS Simulator extends simulations with variable message signs (VMS), which could by dynamically controlled. A VMS can be placed anywhere along a road and
has, amongst others, the following properties:
- *Type* for different traffic sign semantics,
- *Road and lane(s)* it corresponds to,
- *Visibility* as a value telling how well a sign is visible for road users

The concept of a flexible sign type allows testing future traffic signs which are not existent at the moment and also common VMS types like:
- Speed limit signs
- Lane assignment signs (assigns a list of allowed vehicle types to a lane - e.g. Busses, Taxis or even Automated Vehicles)

{{< figure src="../images/vms-simulator_signs-highway.png" title="example of speed and lane assigment in highway scenario" width="85%" >}}

Any properties of a VMS, beside its position and type, can be changed during the simulation.

In each simulation step the VMS Simulator informs vehicles about any VMS that is inside their sight distance. How
vehicles react on VMS can be modeled with the {{< link title="Application Simulator" href="/docs/simulators/application_simulator/">}}.
