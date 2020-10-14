---
title: Documentation
layout: docs  # Do not modify.
toc: false

# Optional header image (relative to `static/img/` folder).
header:
  caption: ""
  image: ""
---

**Eclipse MOSAIC** was built to provide users with the flexibility to perform mobility based simulations 
with their own choice of simulators. In order to provide the flexibility to exchange a simulator without changing the
underlying infrastructure, Eclipse MOSAIC offers interfaces for the integration of different simulators,
e.g. for communication, traffic, and application simulations. For the synchronization and data exchange, 
the provided runtime infrastructure uses common concepts similar to ones defined in the High Level Architecture (HLA
) standard proposed by the IEEE. Simulators are integrated following the ambassador/federate principle and messages
 (we call them interactions) are used to implement the time synchronization and data exchange amongst them. 
Consequently, the runtime infrastructure allows a flexible combination of 
time-discrete simulators for V2X simulations and the like. Based on the varying requirements 
for specific use-cases, arbitrary simulators can be added to Eclipse MOSAIC and will be executed together.

<!--
Eclipse MOSAIC is written in the programming language Java and deployed as Java Archive (JAR) files. Consequently, a
compatible Java Runtime Environment (JRE) for your operating system must be installed. We recommend the 
Java 8 version of [AdoptOpenJDK](https://adoptopenjdk.net/releases.html?variant=openjdk8&jvmVariant=hotspot).
-->

This online documentations provides detailed information for the current release of Eclipse MOSAIC. The following
objectives are target of this documentation:

<!--* Installation of Eclipse MOSAIC
* Configuration of the runtime infrastructure and its coupled simulators.
* Setup and configuration of simulation scenarios.
* Executing simulations with Eclipse MOSAIC.
* Visualization of simulation results.-->

{{< menu_overview docs >}}
