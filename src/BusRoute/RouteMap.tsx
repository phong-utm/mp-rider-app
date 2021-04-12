import React from "react";
// prettier-ignore
import { GoogleApiWrapper, Map, IProvidedProps, Marker, Polyline } from "google-maps-react";

import { Coordinates, RouteData } from "../types";

const googleMapsAPIKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY!;

const PurePolyline = React.memo(Polyline);
const PureMarker = React.memo(Marker);
const stopMarkerStyles = {
  path: 0, // google.maps.SymbolPath.CIRCLE,
  fillColor: "#FFF",
  fillOpacity: 1,
  strokeColor: "#00A",
  strokeOpacity: 0.9,
  strokeWeight: 1,
  scale: 5,
};

class MapContainer extends React.Component<
  IProvidedProps & {
    routeData: RouteData;
    busLocation?: Coordinates;
  }
> {
  render() {
    const { routeData, busLocation } = this.props;
    const { path, stops } = routeData;
    return (
      <Map
        google={this.props.google}
        zoom={15}
        initialCenter={routeData.initialCenter}
      >
        <PurePolyline
          path={path}
          geodesic={true}
          strokeColor="#FF0000"
          strokeOpacity={1}
          strokeWeight={2}
        />
        {stops.map((stop, idx) => (
          <PureMarker key={idx} position={stop} icon={stopMarkerStyles} />
        ))}
        {busLocation && <Marker position={busLocation} icon="bus.svg" />}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: googleMapsAPIKey,
})(MapContainer);
