---
title: Create Applications for MOSAIC with Java
linktitle: Create Applications
toc: true
type: docs
date: "2022-07-20"
draft: false
weight: 1
menu:
  docs:
    parent: develop_applications
    weight: 1
---

Applications in Eclipse MOSAIC are simulated by the [Application Simulator](/docs/simulators/application_simulator). Such 
an application is programmed in Java and follows an event-based execution flow. Thereby, certain methods of the application are called by 
the Application Simulator upon corresponding events (the application "reacts"). To actively gain execution at some later point in time, an 
application can also schedule a generic event itself. When the application is executing, it has access to a set of methods, allowing to 
trigger actions like sensing messages or controlling the vehicle, influencing the current simulation (the application "acts").

## Developing Applications

Developing custom applications in Eclipse MOSAIC is rather easy. The best way to learn it is by looking at the
source code of actual applications. For this purpose, we provide the source code of all tutorial applications
and further examples.

For an easy understanding of the application API, the following general concepts and design philosophies are a good starting point:

* **Requirements to deploy own applications:** In Eclipse MOSAIC it is very easy to build your own application. 
First, it needs to inherit from the `AbstractApplication` class (see following section). Secondly, the application must be mapped to
a vehicle (or RSU, or traffic light, ...) via the mapping configuration (see section [mapping](/docs/scenarios#applications-and-mapping)). 
Finally, the application must be compiled as a Jar-File and placed into the application directory of your
scenario.

* **Accessing functions, e.g. to control vehicles or sending messages:** Every application has access to the `OperatingSystem` of 
the underlying unit which allows to change its state or to initiate actions, such as sending messages to other vehicles.

* **Reacting on events, such as received messages:** For each application you decide, which events the application should listen to.
For example, if your application needs to react upon incoming V2X messages, it simply implements the `CommunicationApplication`
interface. In the following section you can find all available interfaces
applications can implement.

## Create a ’Hello world’ Application Based on Maven

For this example you need to install [Maven](https://maven.apache.org/download.cgi) which is used
to resolve required MOSAIC dependencies and to compile your application Java code into a Jar file.
Follow the steps to build an example application:

1. Create a new folder `HelloWorldApp`:
    ```plaintext
    └─ HelloWorldApp
       ├─ src
       |  └─ main
       |     └─ java
       |        └─ HelloWorldApp.java
       └─ pom.xml
    ```
2. Place a `pom.xml` with the following content:
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
        <modelVersion>4.0.0</modelVersion>
    
        <groupId>org.eclipse.mosaic.app</groupId>
        <artifactId>HelloWorldApp</artifactId>
        <version>0.0.1</version>
        <packaging>jar</packaging>
   
        <properties>
             <maven.compiler.source>1.8</maven.compiler.source>
             <maven.compiler.target>1.8</maven.compiler.target>
        </properties>
      
        <repositories> 
            <repository>
                <id>repo.eclipse.org</id>
                <name>MOSAIC Repository</name>
                <url>https://repo.eclipse.org/content/repositories/mosaic</url>
            </repository>
        </repositories>
                  
        <dependencies>
            <dependency>
                <groupId>org.eclipse.mosaic</groupId>
                <artifactId>mosaic-application</artifactId>
                <version>{{< version of="mosaic" >}}</version>
            </dependency>
        </dependencies>
        
    </project>
    ```
3. Create a new application in `src/main/java/HelloWorldApp.java`:
    ```java
    import org.eclipse.mosaic.fed.application.app.AbstractApplication;
    import org.eclipse.mosaic.fed.application.app.api.VehicleApplication;
    import org.eclipse.mosaic.fed.application.app.api.os.VehicleOperatingSystem;
    import org.eclipse.mosaic.lib.objects.vehicle.VehicleData;
    import org.eclipse.mosaic.lib.util.scheduling.Event;
   
    public class HelloWorldApp extends AbstractApplication<VehicleOperatingSystem> implements VehicleApplication {
        
        @Override
        public void onStartup() {
            getLog().info("Hello World!");
        }
   
        @Override
        public void onVehicleUpdated(VehicleData previousVehicleData, VehicleData updatedVehicleData) {
            getLog().info("Driving {} m/s.", updatedVehicleData.getSpeed());
        }
    
        @Override
        public void onShutdown() {
            getLog().info("Good bye!");
        }
    
        @Override
        public void processEvent(Event event) {
            // ...
        }
    }
    ```
4. Build the application using maven:
    ```shell
    mvn clean install
    ```
5. Copy the JAR file from `target/HelloWorldApp-0.0.1.jar` to the `application` directory of your simulation scenario.
6. Use the fully qualified name `HelloWorldApp` in the `mapping_config.json` to load the application onto vehicles. 

## Debugging of Applications

To debug an application, remote debugging needs to be used. The following steps need to be performed
in order to debug the application:

1. Open the application in your IDE.
2. Modify your `mosaic.sh` or `mosaic.bat` by adding debug parameters to the java call:\
  `java -agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=4100 ...`
3. Add a new debug profile in your IDE for remote debugging. Make sure to correctly configure port `4100` (or whichever port you provided in step 2).
4. Launch Eclipse MOSAIC with the argument `-w 0` to disable the watchdog timer otherwise it will interfere with debugging.
5. Connect your debugger in your IDE with the running simulation.
