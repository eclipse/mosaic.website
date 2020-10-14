+++
widget = "page_header" # Costum Mosaic feature
headless = true  # This file represents a page section.
active = true  # Activate this widget? true/false
weight = 10  # Order that this section will appear.

logo = "/img/EclipseMOSAIC-Logo-RGB-negativ.svg"
logo_title = "Eclipse MOSAIC"
logo_height = "13rem"
#title = "Eclipse MOSAIC"
subtitle = "A Multi-Domain and Multi-Scale Simulation Framework for Connected and Automated Mobility."
alignment = "left" # left or center (default)

[design.background]
  # Background image.
  #image = "fokus.png"  # Name of image in `static/img/`.
  #image_size = "50% auto"  #  Options are `cover` (default), `contain`, or `actual` size.
  #image_position = "center bottom"  # Options include `left`, `center` (default), or `right`.
  #image_opacity = "0.2"
  
  # Text color (true=light or false=dark).
  text_color_light = false


[[button]]
  title = "<i class='fa fa-download' aria-hidden='true'></i> Download Now"
  url = "/download/"

[[button]]
  title = "<i class='fa fa-book' aria-hidden='true'></i> Read the Docs"
  url = "/docs/"

[[button]]
  title = "<i class='fa fa-graduation-cap' aria-hidden='true'></i> Tutorials"
  url = "/tutorials/"

[[feature]]
  name = "Simulator Coupling"
  description = "Eclipse MOSAIC couples best in class simulators together with various built-in simulation models to create complex simulation scenarios quickly and easily. Own simulators can be coupled easily to the runtime infrastructure."
  link_title = "Learn More"
  link_url = "/docs/extending_mosaic/simulator_coupling/"
  link_feature = true
  
[[feature]]
  name = "Multi-Domain / Multi Scale"
  description = "The flexibility of Eclipse MOSAIC allows to combine simulation models of multiple domains (e.g. traffic, communication, applicaiton) on multiple scales (e.g. microscopic-traffic vs. detailled vehicle simulation) which all can be combined."  
  link_title = "Learn More"
  link_url = "/docs/building_scenarios/scenarios/"
  link_feature = true
  
[[feature]]
  name = "Open Source"
  description = "Eclipse MOSAIC is Open Source! This makes it very easy to extend the simulation framework by your own models. You can find the source code of the coupling engine, various simulators and models, and example scenarios on our GitHub page."
  link_title = "Go to GitHub"
  link_url = "https://github.com/eclipse/mosaic"
  link_feature = true

+++
