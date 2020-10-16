+++
# About widget.
# Explain the concept of the Eclipse MOSAIC in this section
widget = "text_image"  # See https://sourcethemes.com/academic/docs/page-builder/
headless = true  # This file represents a page section.
active = true  # Activate this widget? true/false
weight = 5  # Order that this section will appear in.

title = "MOSAIC as Co-Simulation Framework"
+++

{{< figure src="images/common-architecture.jpeg" >}} <!-- TODO update this image -->

Inspired by the HLA standard, Eclipse MOSAIC uses a federate-ambassador concept that enables a coupling of existing simulators 
to our MOSAIC runtime infrastructure (RTI), which handles synchronization and communication of the federates, 
the management of interaction, time and the lifecycle of federates. 

The communication among the federates is enabled by the Eclipse MOSAIC RTI which is accessible by ambassadors similar to the HLA standard.
However, in contrast to the general _Object Model Template (OMT)_ of the HLA standard, the types of data to be exchanged are defined
as an expandable message set, called _Interactions_.


