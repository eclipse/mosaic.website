+++
widget = "page_header" # Costum Mosaic feature
headless = true  # This file represents a page section.
active = true  # Activate this widget? true/false
weight = 10  # Order that this section will appear.

logo = "/img/logos/mosaic/EclipseMOSAIC-Logo-RGB-negativ.svg"
logo_title = "Eclipse MOSAIC"
logo_height = "13rem"
#title = "Eclipse MOSAIC"
subtitle = "A Multi-Domain and Multi-Scale Simulation Framework<br>for Connected and Automated Mobility."
alignment = "left" # left or center (default)

[design.background]
  # Background image.
  image = "background-home-02.jpg"
  image_opacity = "1.0"
  
  # Text color (true=light or false=dark).
  text_color_light = false


[[button]]
  title = "Download Now"
  url = "/download/"
  include_latest_release = true
  icon = "fa fa-download"

[[button]]
  title = "License"
  url = "/about/#license"
  subtitle = "EPL 2.0"
  icon = "fa fa-coffee"

[[button]]
  title = "Read the Docs"
  url = "/docs/"
  icon = "fa fa-book"

[[button]]
  title = "Tutorials"
  url = "/tutorials/"
  icon = "fa fa-graduation-cap"

[[feature]]
  name = "Co-Simulation Framework"
  description = "Eclipse MOSAIC couples best in class simulators together to create complex simulation scenarios quickly and easily. Standardized interfaces allow to couple new simulators without effort to extend the modeling capabilities. "
  link_title = "Learn More"
  link_url = "/about#co_simulation"
  link_feature = true
  
[[feature]]
  name = "Multi-Domain / Multi-Scale Models"
  description = "The flexibility of Eclipse MOSAIC allows to combine simulation models of multiple domains (e.g. application, traffic, communication) on multiple scales (e.g. microscopic-traffic vs. detailed vehicle simulation) which all can be combined."  
  link_title = "Learn More"
  link_url = "/about#model_collection"
  link_feature = true
  
[[feature]]
  name = "Open for Extensions"
  description = "Eclipse MOSAIC is Open Source under the Eclipse Public License 2.0! This makes it very easy to extend the simulation framework by your own models. You can find the source code of the coupling engine, various simulators and models, and example scenarios on our GitHub page."
  link_title = "Contribute"
  link_url = "/contribution/"
  link_feature = true

+++
