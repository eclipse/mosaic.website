+++
# Key features widget.
widget = "text_card"  # See https://sourcethemes.com/academic/docs/page-builder/
headless = true  # This file represents a page section.
active = true  # Activate this widget? true/false
weight = 70  # Order that this section will appear.

title = "Eclipse MOSAIC Key Features"
subtitle = """
- Multi-Aspect V2X Simulation 
- Multi-Domain Simulator Integration
- Multi-Scale Modelling and Simulation   
"""

features_have_background = false

# Date format
#   Refer to https://sourcethemes.com/academic/docs/customization/#date-format
date_format = "Jul 2020"

# Accomplishments.
#   Add/remove as many `[[item]]` blocks below as you like.
#   `title` ist the required parameter.
#   Leave other parameters empty if not required.
#   Begin/end multi-line descriptions with 3 quotes `"""`.

[[item]]
  title = "Eclipse MOSAIC Application Simulator"
  text_col_width = "lg-9"
  image = "/img/placeholder.png"
  image_position = "right"
  image_col_width = "lg-3"
  #link_url = "#"
  #link_title = "TODO: Insert Correct Link"
  description ="""
  - Scenario based testing and simulation of V2X applications.
  - Includes different simulation units and interfaces to run their logic:

    - Vehicles
    - Electric Vehicles
    - Road Side Units
    - Traffic Lights
    - Charging Station
    - Traffic Management Center
   
  - Provides a realistic navigation module based on the World Geodetic System (WGS-84).
  - Assignment of multiple applications to each  simulation unit. 
  - Includes applications for European Telecommunications Standards Institute (ETSI) compliant V2X communication.
  - Reusability and adaptability of application components for further developments.
  - Comprehensive parameterization of specific V2X messages
  """


[[item]]
  title = "Eclipse MOSAIC Communication Simulators"
  text_col_width = "lg-8"
  image = "/img/connected-vehicles.png"
  image_position = "right"
  image_col_width = "lg-4"
  #link_url = "#"
  #link_title = "TODO: Insert Correct Link"
  description = """
  ### Eclipse MOSAIC Cell
  Built-in Cellular Simulator enables the applications to use cellular network communication for V2X scenarios.
  - Supports ITS communication use cases over cellular networks.
  - Involves the UMTS, 4G-LTE and the future 5G technologies.
  - Using the Multi-access Edge Computing (MEC) and Network Function Virtualization (NFV) concepts to simulate compute-intensive V2X applications/services over cellular networks.
  - Modeling of regional transmission models with specific regional characteristics e.g. transmission delay and loss, retransmission, channel capacity.
  - Modeling and simulation of cellular handover.
  - ITS based Addressing and Routing schemes:  
  
    - Topocast
    - Geocast
    - Geobroadcast
    
  <a class="mosaic-btn mosaic-btn-primary" href="/docs/simulators/network_simulator_cell/" title="See Eclipse MOSAIC Cell">See Eclipse MOSAIC Cell</a>

  ### Eclipse MOSAIC Simple Network Simulator
  A built-in Simulator to realize of the ad hoc communication for V2X scenarios.
  - Supports Ad-hoc channels for ITS communication according to IEEE 802.11p-Standard.
  - Includes various routing principles e.g. Geographic Routing and Topological Routing using Singlehop or Multihop protocol.
  - Easy configuration of transmission area.
  - Modeling and simulation of packet retransmission, packet loss and packet errors within the communication range.

  <a class="mosaic-btn mosaic-btn-primary" href="/docs/simulators/network_simulator_sns/" title="See Eclipse MOSAIC SNS">See Eclipse MOSAIC SNS</a>
  """
  
[[item]]
  title = "E-Mobility and Environment Simulators"
  text_col_width = "lg-9"
  image = "/img/placeholder.png"
  image_position = "right"
  image_col_width = "lg-3"
  #link_url = "#"
  #link_title = "TODO: Insert Correct Link"
  description = """ 
  ### Eclipse MOSAIC Battery Simulator
  The built-in Battery Simulator consists three main models (Vehicle, Battery, Environment) to simulate electric vehicles.
  - Description of general vehicle properties in vehicle model.
  - Flexible configuration of battery characteristics in battery model:

    - Cell voltage 
    - State-of-charge (SOC)
    - State-of-health (SOH)
    - Cell capacity
  - Environment model enables the configuration of environment factors affecting the energy consumption of batteries.

  <a class="mosaic-btn mosaic-btn-primary" href="/docs/simulators/battery_simulator/" title="See Eclipse MOSAIC Battery Simulator">See Eclipse MOSAIC Battery Simulator</a>
  
  ### Eclipse MOSAIC Environment Simulator
  A built-in simulator to detect environmental events and react on it in your V2X scenarios.
  - Enables to model and simulate an environmental event for realistic V2X scenarios.
  - Provides different sensor types to detect events vehicles can be equipped with
  - Flexible configuration of an environment event area (Circle, Rectangle).
  -  Detect and react on traffic signs in V2X scenarios.

  <a class="mosaic-btn mosaic-btn-primary" href="/docs/simulators/environment_simulator/" title="See Eclipse MOSAIC Environment Simulator">See Eclipse MOSAIC Environment Simulator</a>
  """
+++
