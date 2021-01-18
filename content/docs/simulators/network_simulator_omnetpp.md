---
title: Network Simulator OMNeT++
linktitle: Network - OMNeT++
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 40
menu:
  docs:
    parent: simulators
---

**OMNeT++** is a simulation platform for discrete-event systems. Even though it is primarily targeted at simulating computer networks and
distributed systems, it cannot be used without any extensions for wireless communication. For this kind of simulations, external model frameworks have to be included.
Currently, there are two prominent model frameworks which cover whole model suites for according focus of wireless research.
These are the Mobility Framework and the **INET** Framework. As INET provides all models necessary for simulating Vehicle-2-X communication,
it is selected for the integration to Eclipse MOSAIC.

For more information on the **INET** extension you should look closer on the [website](https://inet.omnetpp.org).

| | | |
|--------------------------|------------------------------------------------------------------------------------------------------------|:-|
| **Operating System**     | GNU/Linux<br>(Windows with mingw)                                                                          | |
| **License**              | GPL, free to use for academic use                                                                          | |
| **Supported version(s)** | OMNeT++ {{< version of="omnetpp" >}} <br>INET {{< version of="inet" >}} | [http://www.omnetpp.org](http://www.omnetpp.org) <br> [https://inet.omnetpp.org](https://inet.omnetpp.org) |


### Installation

There are two installation types of the MOSAIC OMNeT++ Federate:

| Type                                                                     | Description                     |
|:------------------------------------------------------------------------ |:------------------------------- |
| [USER](#installation-for-users)           | This installation type addresses those who only want to use the **OMNeT++** network simulator for simulations.<br>Network configurations can also be adjusted.<br><br>If you install the federate with this installation type, **OMNeT++ {{< version of="omnetpp" >}}** and **INET {{< version of="inet" >}}** will automatically be installed inside `<mosaic>/bin/fed/omnetpp` during the installation. |
| [DEVELOPER](#installation-for-developers) | The installation for developers addresses those who want to make changes or extend the MOSAIC OMNeT++ Federate.<br><br>This installation type awaits that **OMNeT++ {{< version of="omnetpp" >}}** and **INET {{< version of="inet" >}}** are already installed on your system and<br>- `PATH` contains `/path/to/omnetpp/bin`<br>- `LD_LIBRARY_PATH` contains `/path/to/omnetpp/lib` and `/path/to/inet/src`<br>- `C_INCLUDE_PATH` contains `/path/to/omnetpp/include` and `/path/to/inet/src` |

{{% alert note %}}
If you already have **OMNeT++ {{< version of="omnetpp" >}}** and **INET {{< version of="inet" >}}** installed on your system, but you simply want to use **OMNeT++** for simulations with Eclipse MOSAIC without developing further the MOSAIC OMNeT++ Federate, you may also choose the [installation for developers]({{< ref "/docs/simulators/network_simulator_omnetpp#installation-for-developers" >}}) to avoid multiple installations of **OMNeT++** and **INET** on your system.
{{% /alert %}}

First of all, please make sure that you have the following libraries installed:
`unzip`, `tar`, `bison`, `flex`, `gcc`, `python`, `protoc`

{{% alert note %}}
The installation of the current version of the OMNeT++ Federate was tested with protobuf version {{< version of="omnetpp_protobuf" >}}.  
It is recommended to install this version. Here you receive more information about [how to install protobuf](https://github.com/protocolbuffers/protobuf/blob/master/src/README.md).
{{% /alert %}}

Follow the links and download the source code of OMNeT++, INET and the MOSAIC OMNeT++ Federate:

| Software                            | Version                      | Link |
|:----------------------------------- |:-----------------------------|:--------------------------------- |
| **OMNeT++**                         | {{< version of="omnetpp" >}} | [https://omnetpp.org/download/](https://omnetpp.org/download/) |
| **INET**                            | {{< version of="inet" >}}    | [https://github.com/inet-framework/inet/releases](https://github.com/inet-framework/inet/releases) |
| **MOSAIC OMNeT++ Federate**         | {{< version of="mosaic" >}}  | [https://github.com/mosaic-addons/omnetpp-federate/releases](https://github.com/mosaic-addons/omnetpp-federate/releases) |

Available parameters of `omnet_installer.sh`:

|       | Parameter             | Value                    | Description                                                 |
|:-----:|:--------------------- |:------------------------ |:----------------------------------------------------------- |
| `-t`  | `--installation-type` | `<INSTALLATION_TYPE>`    | Either `USER` or `DEVELOPER`.                               |
| `-o`  | `--omnetpp`           | `<PATH_TO_OMNET_TGZ>`    | Provide the archive containing the OMNeT++ source. You can obtain it from [https://omnetpp.org/download/](https://omnetpp.org/download/) |
| `-i`  | `--inet`              | `<PATH_TO_INET_TGZ>`     | Provide the archive containing the inet source code. You can obtain it from [https://inet.omnetpp.org/Download.html](https://inet.omnetpp.org/Download.html). If not given, the inet-source files are downloaded by this installation script. |
| `-f`  | `--federate`          | `<PATH_TO_FEDERATE_ZIP>` | Provide the archive containing the OMNeT++-federate and patches for coupling OMNeT++ to Eclipse MOSAIC. If not given, the omnetpp-federate is downloaded by this installation script. |
| `-so` | `--skip-omnetpp`      | -                        | Skip the installation of OMNeT++                            |
| `-si` | `--skip-inet`         | -                        | Skip the installation of INET                               |
| `-q`  | `--quiet`             | -                        | Less output and no interaction required                     |
| `-j`  | `--parallel`          | `<NUMBER_OF_THREADS>`    | Enables make to use the given number of compilation threads.<br>Per default your systems maximum is selected automatically. |
| `-u`  | `--uninstall`         | -                        | Uninstalls the OMNeT++ federate                             |
| `-h`  | `--help`              | -                        | Shows this usage screen                                     |

#### Installation for Users

Run the installation script (this takes a few minutes):
```bash
cd <mosaic>/bin/fed/omnetpp
chmod +x omnet_installer.sh`
./omnet_install.sh \
    --installation-type USER \
    --omnetpp /path/to/omnetpp-{{< version of="omnetpp" >}}-src.tgz \
    --inet /path/to/inet-{{< version of="inet" >}}-src.tgz \
    --federate /path/to/omnetpp-federate-{{< version of="mosaic" >}}.zip
```
For the installation type `USER` the parameters `-o`, `-i` and `-f` are required.  
The installation script should terminate with `SUCESS: The MOSAIC OMNeT++ Federate was successfully installed.` otherwise the installation failed.

#### Installation for Developers

Run the installation script (this takes a few minutes):
```bash
cd <mosaic>/bin/fed/omnetpp
chmod +x omnet_installer.sh`
./omnet_install.sh \
    --installation-type DEVELOPER \
    --federate /path/to/omnetpp-federate-{{< version of="mosaic" >}}.zip
```
For the installation type `DEVELOPER` the parameter `-f` is required.  
The installation script should terminate with `SUCCESS: The MOSAIC OMNeT++ Federate was successfully installed.` otherwise the installation failed.

[Extending MOSAIC OMNeT++ Federate]({{< ref "/docs/extending_mosaic/omnetpp_details" >}})

### OMNeT++ Federate Configuration

To use OMNeT++ as network simulator in an Eclipse MOSAIC simulation, open `<scenarioName>/scenario_config.json` and enable OMNeT++:
```json
"federates": {
   ...
   "omnetpp": true,
   ...
}
```
Now, when you run this scenario, Eclipse MOSAIC will automatically start the MOSAIC OMNeT++ Federate.

The main configuration of the MOSAIC OMNeT++ Federate is done within the configuration files `omnetpp.ini` and `omnetpp_config.json` in the scenario:

```FOLDER
└─ <scenario_name>
   └─ omnetpp
      ├─ omnetpp.ini ...................... OMNeT++ federate configuration file
      └─ omnetpp_config.json .............. Ambassador configuration file
```



The whole OMNeT++ specific configuration is done via the `omnetpp.ini` file. It covers static parts for the
simulator coupling such as the specific Eclipse MOSAIC Event Scheduler and the ScenarioManager. Furthermore,
logging configurations and the typical parameters for the communication layers (MAC, PHY and Radio
Channel) are addressed. The communication parameters are different for vehicles and RSUs. Please refer
to the OMNeT++ documentation on the OMNeT++ homepage for further information about the structure
of the `omnetpp.ini` file.


### Installation in Docker environment

{{% alert note %}}
This is an experimental feature. Please refer to our mailing list if you experience any problems.
{{% /alert %}}

This guide gives instructions to execute the OMNeT++ federate inside a docker container. If you already installed
OMNeT++ on your machine following the steps before, you can skip this section.

Docker is a new approach to execute software. More precisely, it "wraps software in a complete filesystem
that contains everything it needs to run: code, runtime, system tools, and system libraries". As a result, the
software is executed within a container and its execution does not rely on the environment the container is running in.

In context of Eclipse MOSAIC, this approach allows to execute OMNeT++ within a docker container. The user does not
need to manually install OMNeT++ and can even run OMNeT++ on Windows hosts.
1. Install Docker ≥ {{< version of="omnetpp_docker" >}} on your machine.
2. To get everything to work, please make sure to execute the following steps depending on your operating system:
    * Windows - In the settings, share the drive where Eclipse MOSAIC is installed on. You may need to restart docker in the reset tab.
    * Linux - Make sure your user account belongs to the unix-group `docker`. You may need to restart your machine.
3. Switch to the location of the Dockerfile in `<mosaic>/bin/fed/omnetpp`
4. Execute the following command on command line:  
    `docker build -t omnetpp-federate`.  
    This could take a while to finish.
5. Enter the name of the docker image `etc/runtime.json` in the `omnetpp`-section into the property `dockerImage`:  
```json
"federates": [
   ...
   {
      "id": "omnetpp",
      "dockerImage": "omnetpp-federate",
      ...
   },
   ...
]
```