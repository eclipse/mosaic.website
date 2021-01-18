---
title: Network Simulator ns-3
linktitle: Network - ns-3
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 50
menu:
  docs:
    parent: simulators
---

The ns-3 is a discrete-event network simulator that was developed as a replacement for the popular
network simulator 2 (ns-2) and mainly focuses upon improving the core architecture, software integration,
models, and educational components for real-world network devices and protocols. It simulates both
unicast and multicast protocols and is used extensively in research on mobile ad-hoc networks.

Regardless, ns-2 still remains in active use and will continue to be maintained in the near future. For
Eclipse MOSAIC coupling, only ns-3 will be available.

Like other network simulators, ns-3 has a relatively steep learning curve, especially compared to GUI-
based simulators. If you have no prior experience with ns-3, we recommend familiarizing yourself with
the ns-3 simulation environment and the ns-3 simulation basics first. The ns-3 documentation can be
found under: {{< target-blank "https://www.nsnam.org/documentation" "https://www.nsnam.org/documentation" >}}

To take your first steps with ns-3, you might want to download 2 the latest version, build a copy of ns-3 (it
uses the Python-based build-system waf) and take a look at the examples, that are shipped within most
of the ns-3 source code repositories and packages. You might also examine the simulation output and try
to adjust it.

Typically, a ns-3 user will work under a Linux environment. For those running under Windows, there do
exist environments which simulate the Linux environment to various degrees. The ns-3 project has in the
past (but not presently) supported the Cygwin environment for these users (see {{< target-blank "http://www.cygwin.com" "http://www.cygwin.com" >}}
for details on downloading). MiniGW is presently not officially supported, however there are also
some people who managed to use it with ns-3. For detailed information of how to set up ns-3, please refer
to their Wiki: {{< target-blank "https://www.nsnam.org/wiki/Installation" "https://www.nsnam.org/wiki/Installation" >}}

For more information on how to set up ns-3 with Eclipse MOSAIC, please just refer to the following section. We
prepared an installation script, which manages most of the required work.

{{% alert warning %}}
As stated above, ns-3 is primarily developed on and for GNU/Linux platforms.
Since Windows is such a widely used platform and Cygwin is not a perfect emulation
of any Linux, we highly recommended for non-Linux users to consider the installation of a
Linux virtual machine with a virtual machine environment, such as
{{< target-blank "VMware" "https://www.vmware.com/products/workstation-player.html" >}} or {{< target-blank "VirtualBox" "https://www.virtualbox.org/" >}}.
{{% /alert %}}

|                                    | Software information                                                                                       |
|:---------------------------------- |:---------------------------------------------------------------------------------------------------------- |
| **Developer(s)**                   | Tom Henderson, Mathieu Lacage, George Riley, Mitch Watrous, Gustavo Carneiro, Tommaso Pecorella and others |
| **Written in**                     | C++ (core) and Python (bindings)                                                                           |
| **Operating system**               | GNU/Linux FreeBSD Mac OS X                                                                                 |
| **License**                        | Free software: GNU GPLv2                                                                                   |
| **Website**                        | {{< target-blank "http://www.nsnam.org/" "http://www.nsnam.org/" >}}                                       |
| **Supported version(s)**           | {{< version of="ns3" >}}                                                                                   |
| **Dependencies**                   | libprotobuf {{< version of="ns3_protobuf" >}}                                                              |
|                                    | libxml2                                                                                                    |
|                                    | libsqlite3                                                                                                 |
| **Deployed in MOSAIC all-in-one** | no (and need a patch to link)                                                                               |

### ns3-ambassador folder structure

```FOLDER
└─ <scenario_name>
   └─ ns3
      ├─ ns3_config.json ................. Ambassador configuration file
      ├─ configTechnologies.xml ...........ns-3 federate configuration file
      └─ confWifi.xml .....................ns-3 federate configuration file
```

### Installation

Eclipse MOSAIC offers support for the current stable release of ns-3 ({{< version of="ns3" >}}), that was released in March 2018. Older
versions of ns-3 (prior to {{< version of="ns3" >}}) are not supported. However, also for newer versions we cannot guarantee
the correct operation. The coupling to Eclipse MOSAIC is designed in a manner of minimal code changes on the
ns-3 simulator itself to keep the update capabilities for future versions.

#### Prerequisites

For GNU/Linux platforms, the minimal requirements to run basic simulations are a **gcc** or **clang** compiler
and a **Python** interpreter. At least you need the following packages to be installed:

***Minimum requirement:***
```
gcc
g++
python
python-dev
```

For a complete list of required packages for different distributions, please refer to the ns-3 installation
guide: {{< target-blank "https://www.nsnam.org/wiki/Installation" "https://www.nsnam.org/wiki/Installation" >}}

Please make sure the following libraries are installed before running the installation script:
* libxml2
* libsqlite3
* libprotobuf {{< version of="ns3_protobuf" >}}

#### Run the installation script

{{% alert warning %}}
ns-3 requires several packages to be installed on your computer. You will
need to ensure, that all required libraries are present on your system before proceeding. You
may need superuser permissions to install packages.
{{% /alert %}}

{{% alert warning %}}
If your local protobuf version does not fit the required one, the installation
may fail with an error. In that case, you can run the install script with the `-p` flag. This will
rebuild the protobuf files during installation and allow it to proceed correctly.
{{% /alert %}}

To ease the installation of ns-3 for Eclipse MOSAIC, the installation process has been delegated to an installation
script, that can be found in the associated ns-3 federate folder.

**ns3-ambassador federate folder structure:**

```FOLDER
└─ mosaic/bin/fed/ns3
   └─ ns3
      ├─ Dockerfile.sh ....................Dockerfile for ns-3 federate
      └─ ns3_installer.sh ................ Installation script for ns-3
```

**The ns-3 installation script accomplishes the following tasks:**
1. Download ns-3 tarball from the official sources
2. Download the ns-3 federate for Eclipse MOSAIC.
3. Apply a patch to ns-3 in order to make it work with Eclipse MOSAIC.
4. Add the ns-3 federate to the waf build system.
5. Configure and build the patched ns-3 with the ns-3 federate.

**In order to start the simulation, the following steps need to be performed:**
1. Set up the `confWifi.xml`-file in the scenario folder (see section [Configuration]({{< ref "/docs/simulators/network_simulator_ns3#configuration" >}})). An example confWifi.xml - file is shipped with the Tiergarten scenario.
2. For reasonable result logging, the logger-configuration in `mosaic/etc/logback.xml` has to be adapted to support the ns-3 ambassador and federate.
3. At last ns-3 has to be activated in the `mosaic_config.xml` and the simulation can be started.

### Installation in Docker environment

{{% alert note %}}
This is an experimental feature. Please refer to our mailing list if you experience any problems.
{{% /alert %}}

This guide gives instructions to execute the ns-3 federate inside a docker container. If you already installed
ns-3 on your machine following the steps before, you can skip this section.

Docker is a new approach to execute software. More precisely, it "wraps software in a complete filesystem
that contains everything it needs to run: code, runtime, system tools, and system libraries". As a result, the
software is executed within a container and its execution does not rely on the environment the container is running in.

In context of Eclipse MOSAIC, this approach allows to execute ns-3 within a docker container. The user does not
need to manually install ns-3 and can even run ns-3 on Windows hosts.
1. Install Docker ≥ {{< version of="ns3_docker" >}} on your machine.
2. To get everything to work, please make sure to execute the following steps depending on your operating system:
    * Windows - In the settings, share the drive where Eclipse MOSAIC is installed on. You may need to restart docker in the reset tab.
    * Linux - Make sure your user account belongs to the unix-group `docker`. You may need to restart your machine.
3. Switch to the location of the Dockerfile in `<mosaic>/bin/fed/ns3`
4. Execute the following command on command line:  
    `docker build -t ns3-federate`.  
    This could take a while to finish.
5. Enter the name of the docker image `etc/runtime.json` in the `ns3`-section into the property `dockerImage`:  
```json
"federates": [
   ...
   {
      "id": "ns3",
      "dockerImage": "ns3-federate",
      ...
   },
   ...
]
```

You can test the installation of your docker image with the Tiergarten scenario, by activating ns3 in the `scenario_config.json`.

### Configuration

The whole ns-3 specific configuration is done via the `confWifi.xml` and `configTechnologies.xml` files.

**confWifi.xml:**
```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<wifi>
    <!-- IPv4 address generator -->
    <ipConfiguration>
        <ip address="192.168.0.0" mask="255.255.0.0"/>
    </ipConfiguration>
    <!-- Calculate a propagation delay -->
    <propagationDelayModel>
        <delay model= "ns3::NonePropagationDelayModel"/>
    </propagationDelayModel>
    <!-- Modelize the propagation loss through a transmission medium -->
    <propagationLossModel>
        <loss model= "ns3::FriisPropagationLossModel"/>
    </propagationLossModel>
    <wifiConfiguration>
        <!-- Create non QoS-enabled MAC layers -->
        <wifiMac property="type" value="ns3::AdhocWifiMac"/>
        <!-- Wifi PHY mode -->
        <wifiManager property="phyMode" value="OfdmRate54Mbps"/>
        <!-- Wifi manager -->
        <wifiManager property="type" value="ns3::ConstantRateWifiManager"/>
        <!-- The energy of a received signal should be higher than this threshold (dbm) to allow the PHY layer to detect the signal -->
        <wifiPhy property="EnergyDetectionThreshold" value="-81.0"/>
        <!-- The energy of a received signal should be higher than this threshold (dbm) to allow the PHY layer to declare CCA BUSY state -->
        <wifiPhy property="CcaMode1Threshold" value="-99.0"/>
        <!-- Transmission gain (dB) -->
        <wifiPhy property="TxGain" value="0.0"/>
        <!-- Reception gain (dB) -->
        <wifiPhy property="RxGain" value="0.0"/>
        <!--  Number of transmission power levels available between TxPowerStart and TxPowerEnd included -->
        <wifiPhy property="TxPowerLevels" value="1"/>
        <!-- Maximum available transmission level (dbm) -->
        <wifiPhy property="TxPowerEnd" value="17.0"/>
        <!-- Minimum available transmission level (dbm) -->
        <wifiPhy property="TxPowerStart" value="17.0"/>
        <!-- Loss (dB) in the Signal-to-Noise-Ratio due to non-idealities in the receiver -->
        <wifiPhy property="RxNoiseFigure" value="0.0"/>
        <!-- Channel center frequency = Channel starting frequency + 5 MHz * (nch - 1) -->
        <wifiPhy property="ChannelNumber" value="1"/>
      </wifiConfiguration>  
</wifi>
```

The IP configuration information includes the network address and network mask. The ns-3 propagation
module defines two generic interfaces, namely **PropagationLossModel** and **PropagationDelayModel**,
for the modelling of propagation loss respectively propagation delay.

In the default `confWifi.xml`, the Wi-Fi device uses the ns-3 standard propagation delay model
`ns3::ConstantSpeedPropagationDelayModel` and the ns-3 standard propagation loss model
`ns3::FriisPropagationLossModel`. Radio propagation models in ns-3 can easily be exchanged with
the ns-3 class registration system (see the ns-3 documentation for details). The Wi-Fi configuration
includes additional parameters, like sending power and antenna gain.

**configTechnologies.xml:**
```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <ns3Configuration>
    <installers>    
        <installer type="ns3::WifiVehicleInstaller" name="WifiVehicle" file="confWifi.xml" default="true" />
        <installer type="ns3::MobilityModelInstaller" name="Mobility" default="true" /> 
    </installers>
</ns3Configuration>
```

The configuration manager of the ns-3 federate defines, which installer should be loaded for the Wi-Fi
device (refering to the `confWifi.xml`) and the mobility model. Usually, you don’t need to take any
changes and simply use the default configuration file, that ships with the ns-3 federate.