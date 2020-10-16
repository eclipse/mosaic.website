+++
# About widget.
widget = "text_image"  # See https://sourcethemes.com/academic/docs/page-builder/
headless = true  # This file represents a page section.
active = true  # Activate this widget? true/false
weight = 5  # Order that this section will appear in.

title = "MOSAIC as Co-Simulation Framework"

img = "common-architecture.jpeg"
img_position = "right" # left, right or top
img_column_width = "7" # 0 - 12

+++

With standardized interfaces, inspired by HLA (High Level Architecture), Eclipse MOSAIC employs the concept of Federates and Ambassadors to couple individual simulators to the whole environment. Each simulator is wrapped into a Federate object, which is linked to an Ambassador for direct connection with the MOSAIC runtime infrastructure (RTI).

The RTI handles all management tasks for the lifecycle of simulation; such as the federation management to start and stop simulators, the interaction management to exchange data between simulators, and the time management to synchronize the event processing in all simulators.
