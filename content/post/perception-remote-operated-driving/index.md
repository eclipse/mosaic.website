---
title: AI-NET-ANTILLAS - Perception for Remote Operated Driving
categories:
  - Simulation
summary:
tags: [smart mobility, ai-net]
date: "2024-07-02T00:00:00Z"
lastMod: "2024-07-02T00:00:00Z"
featured: false
draft: false

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
image:
  placement: 2
  caption: ""
  focal_point: ""
  preview_only: true

# Projects (optional).
#   Associate this post with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `projects = ["internal-project"]` references 
#   `content/project/deep-learning/index.md`.
#   Otherwise, set `projects = []`.
projects: []
---

**After four years of research, the AI-NET-ANTILLAS project has concluded, and the final event took place in conjunction with the Berlin 6G Conference 2024. Collaborating with our partners,
we integrated several key components: Cloud-based LIDAR processing, next generation networks, and artificial intelligence,
to create a new service and application platform.**

At DCAITI and Fraunhofer FOKUS, we concentrated on a specific use case: Remote Operated Driving.
For remote operators, it is essential to have a current and detailed understanding of the automated
vehicle's surroundings. Processing the LIDAR data in the cloud enables the possibility of merging data from neighboring sensor sources to obtain a holistic picture and improve environment perception.
However, this application exhibits challenges in terms of latency, jitter, data volume, and scalability. These aspects have been studied thoroughly within the project.
{{< figure src="./RemoteOperation.svg" width="60%" title="Remote operated driving with data from two sources.">}}

## COOL-Fusor
As a core component, we developed the "**C**loud-based **O**bject **O**r **L**idar (COOL)-Fusor" to merge data from multiple sensors in the same area, enhancing situational awareness.
The COOL-Fusor improves detection quality, particularly when one sensor is obstructed.
It operates on a server and ingests data from vehicles' LIDAR sensors, communicated over the cellular network.
After the fusion step, object detection is performed on the combined data.

{{< figure src="./COOL_Fusor.png" width="100%" title="Scenario with COOL Fusor use case.">}}


## Simulation
Our solution based on artificial intelligence for object detection required realistic sensor data on a large scale for training, testing and evaluation.
We leveraged Eclipse MOSAIC with its modelling capabilities and PHABMACS, our in-house vehicle simulator, accordingly.

The simulated data for training our machine learning model included specific features of merged LIDAR point clouds from multiple vehicles. 
Without simulation, the process of capturing these data with multiple vehicles would have been a prohibitively expensive and time-consuming endeavor.
We created numerous scenarios that include various vehicle maneuvers and environments, enabling us to compile a vast dataset tailored to our use case. 
Furthermore, a simulated environment allows to create training data for virtually every situation imaginable, increasing coverage of different road layouts, street sights, and anomalies.

{{< figure src="./scenarios.png" width="100%" title="Picture of AI-NET-ANTILLAS scenarios with different aspects">}}


## Training
To detect vehicle objects in the transmitted sensor data, we employed a machine learning model on the basis of the OGM (occupancy grid map) approach for LIDAR data.
Initially, the model was trained using data generated from our various scenarios.
Furthermore, we created datasets containing errors such as measurement inaccuracies, LiDAR acquisition errors, and limiting factors of the network such as delays and jitter.
These obstructions introduced more variety into the training and prepared the model for cases where the received data is suboptimal.
Continuous evaluation and retraining ensured the model remained robust and accurate, even as new data and scenarios were introduced.
{{< figure src="./training.png" width="80%" title="Example frame with model detections and ground truth and influence of errors on pointclouds">}}


## Network and Transmission
We further simulated the transmission of sensor data from vehicles to a remote server,
where the COOL-Fusor and object detection could be executed and visualized for the operator.
The network simulation was achieved using the Cell Simulator embedded in Eclipse MOSAIC.
This aspect of the project ensured that data transmission latency and bandwidth constraints were realistically modeled, providing insights into the performance of the overall remote operated driving systems under various network conditions.

## Final results
Our final outcomes included a well-trained model for detecting car-sized vehicles in LiDAR point clouds, based on data simulated by Eclipse MOSAIC, and a novel point cloud fusion approach using the COOL-Fusor.
These results demonstrate the feasibility and effectiveness of our approach, paving the way for future advancements in remote and teleoperated driving and autonomous vehicle technologies.
<div style="text-align: center;margin-bottom: 10px">
<video controls style="width:60%;margin-bottom: 1px;margin-top:3px;text-align: center">
  <source src="https://media.dcaiti.tu-berlin.de/mosaic/ai-net-rod/AINET-ANTILLAS-FINAL.mp4" type="video/mp4">
</video>
<b>Watch this demonstration to get an overview of the capabilities implemented in Eclipse MOSAIC</b>
</div>
