---
title: Workshop Electric Vehicle
categories:
   - Workshop
linktitle: workshop_electric_vehicle
toc: false
type: workshops
draft: false
pagination_prev: parking_observer
---

The increasing adoption of electric vehicles (EVs) presents unique challenges and opportunities for optimizing travel efficiency. This workshop aims to explore the journey optimization of an electric vehicle traveling from Berlin to Rostock, focusing on effective charging strategies and route planning. Participants will engage in exercises designed to enhance their understanding of EV charging dynamics and improve travel time while maintaining battery health.

**Base Scenario** \
The workshop centers around a simulated journey of an electric vehicle with a limited battery range from Berlin to Rostock, a distance of approximately 230 km. The EV starts with a specific battery charge level and must navigate the route while identifying charging points to ensure it never drops below a critical charge level of 5%. The scenario involves evaluating various charging station options, including fast chargers, and optimizing the travel time by considering charging durations and station availability.

{{< figure src="images/charging-stations.png" width="400" title="Possible charging stations" >}}

**Exercise I: Search Reactively** \
Implement a reactive search mechanism that triggers when the EV's battery charge drops below 20%. The system should identify nearby charging stations within a 5 km radius of the current location, ensuring that the vehicle does not reach a charge level below 5%.

**Exercise II: Optimize Total Travel Time** \
Develop an optimization algorithm that calculates the most efficient travel route to Rostock by evaluating charging options. This includes prioritizing quick chargers with 100 kW+ capability and assessing their availability along the route to minimize overall travel time.

**Exercise III: Reserve Charging Station** \
Create a proactive reservation system that allows the driver to book a charging station at the start of the journey. This system should consider the estimated time of arrival at each charging station and ensure that the selected station has the necessary charging capacity available.

**Conclusion** \
By the end of the workshop, participants will have gained practical experience in journey optimization for electric vehicles. They will learn how to implement reactive and proactive charging strategies, assess the impact of charging station availability on travel time, and develop algorithms to enhance the overall efficiency of EV travel. This knowledge will empower participants to make informed decisions regarding EV route planning and charging management in real-world applications.