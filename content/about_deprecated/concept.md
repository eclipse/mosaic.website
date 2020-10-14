+++
# About widget.
# Explain the concept of the Eclipse MOSAIC in this section
widget = "text_image"  # See https://sourcethemes.com/academic/docs/page-builder/
headless = true  # This file represents a page section.
active = true  # Activate this widget? true/false
weight = 30  # Order that this section will appear in.

title = "Concept of Eclipse&nbsp;MOSAIC"
#subtitle = ""

#img = "simulator-coupling.png" # image path
#img_position = "left" # left or right
#img_column_width = "5" # 0 - 12

#[[button]]
#  title = "Follow link"
#  url = "#asd"
#[[button]]
#  title = "Follow link"
#  url = "#asd"
+++


Inspired by the HLA standard, Eclipse MOSAIC uses a federate-ambassador concept that enables a connection to our MOSAIC runtime infrastructure which handle synchronization and communication of the federates, the management of interaction, time and the lifecycle of federates.

The communication among the federates is enabled by Eclipse MOSAIC RTI which is accessible by ambassadors similar to the HLA standard. However, in contrast to the general _Object Model Template (OMT)_ of the HLA standard, the types of data to be exchanged are defined as an expandable message set.

{{< figure library="true" src="simulator-coupling.png" width="800" height="200" title="An Example of simulator coupling by Eclipse MOSAIC" lightbox="false" >}}

A common V2X communication scenario involves various aspects of the real world. In particular, a microscopic traffic simulator is used to simulate the movements of the vehicles. Moreover, a network simulator simulates the wireless communication between the vehicles and an application simulator provides the environment for the simulation of a V2X application as well as an environment simulator to simulate the environmental influences (weather conditions, obstacles). In order to make the preparation and execution of V2X communication simulations as easy as possible, Eclipse MOSAIC supports the user at all simulation layers with built-in or pre-configured external simulators and provides various analysis and evaluation tools.

Eclipse MOSAIC which enables the preparation and execution of V2X simulations. It is the most flexible system available in the automotive research arena to dynamically simulating traffic flow. 

{{< figure library="true" src="mosaic-layers.png" width="800" title="V2X Simulation Layers of Eclipse MOSAIC" lightbox="false" >}}

### Quick Access to Eclipse MOSAIC 

In the Standard Edition, Eclipse MOSAIC offers built-in simulators and external simulators for which the remote interface is pre-implemented, so you can quickly and easily start with V2X communication scenarios. In order to be able to analyze and evaluate your simulation results in detail, Eclipse MOSAIC also provides powerful tools for statistical analysis, visualization and result recording. In the following figure the Standard Edition of Eclipse MOSAIC is shown schematically. See [Documentation]({{< ref "/docs/visualization/_index.md" >}}) for further details.

{{< figure library="true" src="mosaic-structure_grey-text.png" title="Simulators included in Eclipse MOSAIC" lightbox="false" >}}