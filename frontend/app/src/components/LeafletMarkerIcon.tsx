import React from "react";
import { Icon } from 'leaflet'

// TODO: crear marker para leaflet completo que reciba position, name como props
export const LeafletMarkerIcon = new Icon({
    iconUrl: "/assets/images/map-pin.svg",
    iconSize: [40, 40]
})
