---
title: Run a simulation with Eclipse MOSAIC
linktitle: Run Eclipse MOSAIC
toc: true
type: docs
date: "2019-05-05T00:00:00+01:00"
draft: false
weight: 20
menu:
  docs:
    parent: getting_started

# Prev/next pager order (if `docs_section_pager` enabled in `params.toml`)
---

Start a simulation with Eclipse MOSAIC using the command line:

```bash
./mosaic.sh -s Barnim -v
```

```dos
mosaic.bat -s Barnim -v
```

{{< figure src="../images/mosaic-barnim.gif" title="Barnim scenario" numbered="true" >}}

## Simulation results

All active simulators as well as the according ambassadors generate certain logging output, depending on their configured logging level.
Therefore, these logs are very helpful to retrace and understand the individual states during the simulation time.

However, these logs do not conform to a generic formatting. For uniformly formatted or visually prepared results,
Eclipse MOSAIC offers different Visualizers. For example, the `FileVisualizer` generates detailed outputs of e.g. vehicle positions, speeds, or message exchanges.
