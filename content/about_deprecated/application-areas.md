+++
# Application Area widget.
widget = "features_widget"  # See https://sourcethemes.com/academic/docs/page-builder/
headless = true  # This file represents a page section.
active = true  # Activate this widget? true/false
weight = 40  # Order that this section will appear.
feature_image_height = "250px"
title = "Application Areas"
subtitle = ""

# Date format
#   Refer to https://sourcethemes.com/academic/docs/customization/#date-format
date_format = "Jul 2020"

# Accomplishments.
#   Add/remove as many `[[item]]` blocks below as you like.
#   `title` ist the required parameter.
#   Leave other parameters empty if not required.
#   Begin/end multi-line descriptions with 3 quotes `"""`.

[[feature]]
  title = "Connected Mobility"
  description = """
  High performance simulations with communication capable Traffic Lights, Roadside Units (RSU), Vehicles and Vulnerable Road Users (VRU).

  <b>Different communication modes and message types according to:</b> 
  - V2X Communication via Cellular V2X (C-V2X)
  - V2X Communication via Vehicle ad hoc networks (VANET)

  <b>Message Types:</b>
  - Cooperative Awareness Message (CAM)
  - Decentralized Environmental Notification Message (DENM)
  - Signal Phase and Timing Message (SPaT)
  """
  #image = "/img/connected-vehicles_grey-street.png"
  link_title = "Learn More"
  link_url = "/docs/extending_mosaic/communication/"
  link_feature = false
  col_md = 6

[[feature]]
  title = "E-Mobility and Smart Grid"
  description ="""
  - Simulation and verification of sustainable e-mobility strategies.
  - Testing of intelligent charging infrastructure concepts.
  - Analysis of Vehicle Energy Management Systems. 
  - High flexible Battery Simulator.
  """
  #image = "/img/e-mobility_grey-street.png"
  link_title = "Learn More"
  link_url = "/docs/extending_mosaic/communication/"
  link_feature = false
  col_md = 6
  
[[feature]]
  title = "Autonomous Driving"
  description ="""
  - Simulation of traffic models with various penetration rate (hybrid traffic).
  - Advanced driver assistance systems (ADAS).
  - Simulation of different levels of Driving Automation.
  """
  #image = "/img/placeholder.png"
  link_title = "Learn More"
  link_url = "/docs/extending_mosaic/communication/"
  link_feature = false
  col_md = 6

[[feature]]
  title = "Smart Public Safety"
  description = """
  - Integration of VRU (pedestrian, cyclist) into V2X scenarios.
  - Traffic Management Center to increase the safety.
  - Development of Safety Applications.
  """
  #image = "/img/public-safety.png"
  link_title = "Learn More"
  link_url = "/docs/extending_mosaic/communication/"
  link_feature = false
  col_md = 6
+++
