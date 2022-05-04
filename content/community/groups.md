+++
widget = "cards"
headless = true  # This file represents a page section.
active = true  # Activate this widget? true/false
weight = 30  # Order that this section will appear in.

title = "Who are we?"
subtitle = "Eclipse MOSAIC is maintained and developed by<br>various people from different groups."

[[card]]
    padding_top = "1.3rem"
    text = """The [Fraunhofer Institute for Open Communication Systems (FOKUS)](https://www.fokus.fraunhofer.de/asct) is the leading group behind the
        simulation framework Eclipse MOSAIC, which has now been developed over the last 12 years in close cooperation
        with the DCAITI of the TU Berlin and has already been used by more than 600 partners and researches to test
        smart mobility services and intelligent traffic scenarios."""
    [card.width]
        default = "11"
        sm = "10"
        md = "6"
        lg = "5"
    [card.image]
        file = "/img/logos/partners/fh_fokus.png"
        url = "https://www.fokus.fraunhofer.de/asct"
        alt = "Fraunhofer logo"
        width = "75%"
        wrap_height = "4.2rem"
        vertical_alignment = "center"
    [card.button]
        title = "Visit Fraunhofer FOKUS"
        url = "https://www.fokus.fraunhofer.de/asct"
[[card]]
    padding_top = "1.3rem"
    text = """The [Daimler Center for Automotive IT Innovations (DCAITI)](https://www.dcaiti.tu-berlin.de/) was founded in 2006 as a joint initiative of
        Daimler AG and the Technical University of Berlin. The DCAITI uses Eclipse MOSAIC since many years for
        various research projects in the field of automated and connected driving. Together with the TU Berlin 
        students gain practical experience in software development by using and extending this simulation framework
        and models."""
    [card.width]
        default = "11"
        sm = "10"
        md = "6"
        lg = "5"
    [card.image]
        file = "/img/logos/partners/dcaiti.svg"
        url = "https://www.dcaiti.tu-berlin.de/"
        alt = "DCAITI logo"
        width = "70%"
        wrap_height = "4.2rem"
        vertical_alignment = "center"
    [card.button]
        title = "Visit DCAITI"
        url = "https://www.dcaiti.tu-berlin.de/"
[[card]]
    text = """The [openMobility Working Group](https://openmobility.eclipse.org/) was founded to support the development and broad introduction of open
        source mobility modeling and simulation technologies. The aim of the Working Group is to deliver a openMobility
        framework of tools based on validated models, which are accepted as standard tools in industry applications and
        academia. Eclipse MOSAIC is one part of the broad range of tools developed in this group."""
    [card.width]
        default = "11"
        sm = "10"
        md = "6"
        lg = "5"
    [card.image]
        file = "/img/logos/partners/open-mobility.png"
        url = "https://openmobility.eclipse.org/"
        alt = "DCAITI logo"
        width = "60%"
        wrap_height = "5.5rem"
        vertical_alignment = "center"
    [card.button]
        title = "Visit openMobility Working Group"
        url = "https://openmobility.eclipse.org/"
+++