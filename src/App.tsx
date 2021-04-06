import React, { useEffect, useState } from "react";

import { Coordinates, RouteData } from "./types";
import MapContainer from "./MapContainer";

const webSocketURL = process.env.REACT_APP_WEB_SOCKET_URL;
const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

function getRouteData(route: string): Promise<RouteData> {
  return fetch(`${apiBaseURL}/routes/${route}`)
    .then((res) => res.json())
    .then(({ origin, destination, links, centerLocation }) => {
      const path = links.reduce((tmp: Coordinates[], link: any) => {
        const points = link.points.map(({ lat, lng }: any) => ({ lat, lng }));
        return [...tmp, ...points];
      }, []);
      const stops = links.map((l: any) => {
        const { lat, lng } = l.points[0];
        return { lat, lng };
      });

      // const midPoint = path[Math.floor(path.length / 2)];

      return {
        origin,
        destination,
        path,
        stops,
        initialCenter: centerLocation, // midPoint,
      };
    });
}

function App() {
  const [route, setRoute] = useState<RouteData | undefined>(undefined);
  const [position, setPosition] = useState(undefined);
  const [estimatedArrival, setEstimatedArrival] = useState<
    Array<{ stop: string; seconds: number }> | undefined
  >(undefined);

  useEffect(() => {
    getRouteData("R").then(setRoute);

    const ws = new WebSocket(webSocketURL!);
    ws.onmessage = (evt) => {
      const { location, arrival } = JSON.parse(evt.data);
      if (location) {
        setPosition(location);
      }
      if (arrival) {
        setEstimatedArrival(arrival);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ position: "relative", flexGrow: 1 }}>
        <MapContainer route={route} position={position} />
      </div>
      {estimatedArrival && estimatedArrival.length > 0 && (
        <EtaPanel estimatedArrival={estimatedArrival} />
      )}
    </div>
  );
}

function EtaPanel(props: {
  estimatedArrival?: Array<{ stop: string; seconds: number }>;
}) {
  return (
    <div
      className="container"
      style={{ maxHeight: 200, width: "100%", maxWidth: "100%", margin: 0 }}
    >
      <div className="panel">
        <p className="panel-heading">Estimated Arrival Times</p>
        {props.estimatedArrival?.map(({ stop, seconds }) => (
          <p className="panel-block is-justify-content-space-between">
            {stop}
            <span className="is-right">{formatETA(seconds)}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

function formatETA(seconds: number) {
  if (seconds < 15) {
    return "Now";
  } else if (seconds < 60) {
    return "< 1 min";
  }
  const mins = Math.round(seconds / 60);
  return mins === 1 ? "1 min" : `${mins} mins`;
}

export default App;
