---
title: Integrated Test and Evaluation Framework (ITEF)
linktitle: ITEF
toc: false
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 40
menu:
  docs:
    parent: visualization
---

{{% alert extended %}}
The **ITEF** is part of {{< link title="MOSAIC Extended" href="/download#overview" >}}.  
For further information on licenses, feel free to contact us via **[mosaic@fokus.fraunhofer.de](mailto:mosaic@fokus.fraunhofer.de)**.
{{% /alert %}}

The Integrated Test and Evaluation Framework (ITEF) is a webtool for planning and evaluating vehicular communication scenarios. It is suited for field operational tests as well as simulations.

ITEF also offers a variety of visualization features, making a comparison of different vehicles or between equipped and unequipped vehicles easy. It is structured into 4 screens, whereas the following 3 screens are intended for the visualization.

The Replay screen (see Figure 1) is intended to be used for an initial overview of the test run. The main feature is the display of the vehicle movements on a map, while the player can be used to playback the movement situation. In this manner, the ITEF allows a location and time dependent evaluation of simulation test runs.

{{< figure src="../images/replayrun.png" title="ITEF Replay Screen" numbered="true" >}}

The Evaluate screen (see Figure 2) allows the detailed investigation of the correlations in a test run. The main feature of this screen is to display the behavior summarized over the whole run. The structure of this screen with is similar to the Replay screen. However, the focus here is on the detailed (statistical) summary of evaluated metrics.

{{< figure src="../images/evaluaterun.png" title="ITEF Evaluate Screen" numbered="true" >}}

Finally, the Statistics screen (see Figure 3) provides statistical evaluations of the test and simulation
run. Currently, statistics on Vehicle Speed, Travel Time, Travel Distance and severalmore are supported.

{{< figure src="../images/statistics.png" title="ITEF Statistics Screen" numbered="true" >}}
