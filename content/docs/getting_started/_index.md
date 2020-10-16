---
title: Download Eclipse MOSAIC
linktitle: Download
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 10
menu:
  docs:
    parent: getting_started
---

<div style="text-align: center;">
{{< button type="primary" link="https://www.dcaiti.tu-berlin.de/research/simulation/download/" title="Download Eclipse MOSAIC from DCAITI mirror" >}}
</div>

1. **Download the `eclipse-mosaic-20.0.zip` bundle from the link above.** 
2. Extract the package to an arbitrary path. This installation path is referenced as `<mosaic-root>` throughout the entire document.
3. Install additional software required by the simulation (see below), e.g. [Eclipse SUMO](https://www.eclipse.org/sumo)

## Folder Content

```FOLDER
└─ <mosaic-root>
   ├─ etc
   |   ├─ hosts.json .................. Configuration of the execution host, e.g. temporary directory.
   |   ├─ logback.xml ................. Configuration of log files and levels.
   |   └─ runtime.json ................ Configuration of all Ambassadors and Federates coupled with the MOSAIC
   ├─ lib ............................. Directory with all Java compiled libraries required for MOSAIC.
   ├─ logs ............................ Directory with log files.
   ├─ scenarios ....................... Directory containing all simulation scenarios.
   ├─ tools ........................... Additional tools, like the HTML Visualizer.
   ├─ CONTRIBUTING.md 
   ├─ LICENSE 
   ├─ mosaic.bat ...................... Start script for Windows systems.
   └─ mosaic.sh ....................... Start script for GNU/Linux systems.
```

## Additional Software

The following table gives an overview of supported environments and simulators. Please make sure that you install those versions only.

|  Component  | Required | | Version | |
|:-----------:|:----------:|:-:|:----------:|:-:|
| **[Java](https://adoptopenjdk.net/?variant=openjdk8&jvmVariant=hotspot)** | yes | Java 7 and below<br/> _not supported_ | **Java 8** <br/> _supported_ | **Java 11** and above <br/> _limited supported_ |
| | | | | |
| **[Eclipse SUMO](https://www.eclipse.org/sumo)** | yes* | 0.32.0 and below<br/> _not supported_| **1.0.1 to 1.6.0** <br/> _supported_ | above 1.6.0 <br/> _not tested_ |
| **[OMNeT++](https://omnetpp.org/download/old)** | optional | 5.4 and below<br/> _not supported_| **5.5** <br/> _supported_ | 5.6 and above <br/>  _not supported_ |
| **[INET](https://inet.omnetpp.org/Download.html)** | optional | 4.0 and below<br/> _not supported_| **4.1** <br/> _supported_ | 4.2 and above <br/> _not supported_ |
| **[ns-3](https://www.nsnam.org/releases/ns-3-28)** | optional | 3.27 and below<br/> _not supported_| **3.28** <br/> _supported_ | 3.29 and above <br/> _not tested_ |

\* All provided scenarios require SUMO to be installed. However, if a different traffic or vehicle simulator 
is coupled, SUMO is not certainly required.

## Update Eclipse MOSAIC

In order to update Eclipse MOSAIC to a new version, please perform the following steps manually:
* Backup your personal simulation scenarios from MOSAIC's scenarios directory.
* Remove your old MOSAIC installation completely.
* Install MOSAIC by extracting the current binary archive from above.
* Copy your simulation scenarios back to MOSAIC's scenarios directory.
* Take care of possible updates of the used software and simulators from third party (see the Compatibility Matrix above).