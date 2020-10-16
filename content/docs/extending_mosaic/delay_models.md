---
title: Delay Models
linktitle: Delay Models 
toc: true
type: docs
date: "2020-06-30T00:00:00+01:00"
draft: false
weight: 70
menu:
  docs:
    parent: extending_mosaic
---

MOSAIC has different types of delays implemented for different use cases. This page will
give a short introduction into the types and their usages, as well as example configurations,
which are used throughout MOSAIC. The implementations can be
found in the package `org.eclipse.mosaic.lib.model.delay`.
Note prior to the release of MOSAIC delay values were configured using Milliseconds as unit,
this has been refactored to Nanoseconds. Alternatively you can specify delay values using
a String with a unit (eg `"delay": "20 ms"`).

## Delay Models

The `Delay` class represents an implementation for a specific delay model. The following model implementation exist:

### ConstantDelay
The `ConstantDelay`-class is arguably the simplest implementation of `Delay`. This model is configured with a single
field `delay`, which the `generateDelay(...)`-method will simply return.  
While this delay doesn't provide realistic behaviour in most cases it is optimal for testing purposes as it
can easily be retraced.

__Configuration:__
```json
"delay": {
    "type": "ConstantDelay",
    "delay": "20 ms"
}
```

### SimpleRandomDelay
The `SimpleRandomDelay` model allows for the generated delays to be randomly distributed between a `minDelay` and a `maxDelay`.
Additionally, the `steps` field is used to limit the amount of different delays, by equally separating the interval into
the amount of steps specified. This delay provides a simple and performant way to randomize and thereby more realistically reflect real-world delays.

For example, with the configuration below, one of the following delays is randomly chosen: `[0.4, 0.9, 1.4, 1.9, 2.4] ms`. 

__Configuration:__
```json
"delay": {
    "type": "SimpleRandomDelay",
    "steps": 5,
    "minDelay": "0.4 ms",
    "maxDelay": "2.4 ms"
}
```

### Gamma Delays
MOSAIC provides two types of delays using a Gamma-distribution to sample values, namely `GammaRandomDelay` and `GammaSpeedDelay`.
The parameters for the used Gamma-distribution have been determined experimentally. The `GammaSpeedDelay` extends the `GammaRandomDelay`
by a speed penalty. Both delay-types aim to provide more realistic solution, than the previous models, but come with the downside of complexity.

__Configurations:__
```json
"delay": {
    "type": "GammaRandomDelay",
    "minDelay": "10 ms",
    "expDelay": "30 ms"
}
```
```json
"delay": {
    "type": "GammaSpeedDelay",
    "minDelay": "10 ms",
    "expDelay": "30 ms"
}
```