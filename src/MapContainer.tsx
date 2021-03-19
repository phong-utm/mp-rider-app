import React from "react";
// prettier-ignore
import { GoogleApiWrapper, Map, IProvidedProps, Marker, Polyline } from "google-maps-react";

import { Coordinates, RouteData } from "./types";

interface MapContainerProps {
  route?: RouteData;
  position?: Coordinates;
}

class MapContainer extends React.Component<IProvidedProps & MapContainerProps> {
  render() {
    if (!this.props.route) {
      return <div>Loading...</div>;
    }

    const { path, initialCenter, stops } = this.props.route;
    return (
      <Map google={this.props.google} zoom={15} initialCenter={initialCenter}>
        <Polyline
          path={path}
          geodesic={true}
          strokeColor="#FF0000"
          strokeOpacity={1}
          strokeWeight={2}
        />
        {stops.map((stop) => (
          <Marker
            position={stop}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: "#FFF",
              fillOpacity: 1,
              strokeColor: "#00A",
              strokeOpacity: 0.9,
              strokeWeight: 1,
              scale: 5,
            }}
          />
        ))}
        {this.props.position && (
          <Marker position={this.props.position} icon="bus.svg" />
        )}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAq-mql7xYPzFU9-3cNEVUt2RilzX6k8Bw",
})(MapContainer);
