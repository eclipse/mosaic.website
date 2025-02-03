---
title: Publication of the LUCID Dataset
categories:
  - Simulation
summary: We are excited to announce the release of the LUCID Dataset, a novel synthetic street-view LiDAR dataset designed to advance computer vision and object detection in the automated driving domain. Comprising 100 scenarios with approximately 1.1 hours of drive time, 40,000 frames, and 500,000 bounding boxes, the LUCID Dataset is a significant resource for researchers and developers.
tags: []
date: "2024-12-11T00:00:00Z"
lastMod: "2022-12-11T00:00:00Z"
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

{{< figure src="featured.png" numbered="false" width="60%" >}}

**We are excited to announce the release of the LUCID Dataset, a novel synthetic street-view LiDAR dataset designed to advance computer vision and object detection in the automated driving domain. Comprising 100 scenarios with approximately 1.1 hours of drive time, 40,000 frames, and 500,000 bounding boxes, the LUCID Dataset is a significant resource for researchers and developers.**

{{< figure src="lucid-facts.png" numbered="false" width="60%" >}}

The LUCID dataset has been generated using Eclipse MOSAIC alongside with SUMO for route and traffic density modeling, and CARLA for simulating advanced LiDAR sensors and environments, following an extensive analysis of other datasets like KITTI, nuScenes and PreSIL. This innovative approach allows for effective cross-dataset generalization, bridging the gap between real and synthetic LiDAR data.

For a comprehensive overview of our methodology, we invite you to read our paper titled *"Cross-Dataset Generalization: Bridging the Gap between Real and Synthetic LiDAR Data"* which we presented at the [SIMUtools 2024 Conference](https://simutools.eai-conferences.org/2024/) (taking place 09-10 December 2024).

The LUCID Dataset is free for download. It is organized in a familiar structure, following KITTI formatting, and includes both labeled and raw data. To facilitate initial exploration, we provide four sample scenarios, with the full dataset available for download.

For additional information and download links, please visit our dedicated website: [https://www.dcaiti.com/research/simulation/lucid](https://www.dcaiti.com/research/simulation/lucid)
