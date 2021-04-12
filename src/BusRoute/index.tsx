import React, { useEffect, useState } from "react";

import RouteMap from "./RouteMap";
import ETAPanel from "./ETAPanel";
import { Coordinates, RouteData } from "../types";

const webSocketURL = process.env.REACT_APP_WEB_SOCKET_URL!;
const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

function getRouteData(route: string): Promise<RouteData> {
  console.log("Loading data for route ", route, "....");
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

function BusRoute(props: { routeId: string }) {
  const { routeId } = props;
  const [routeData, setRouteData] = useState<RouteData | undefined>(undefined);
  const [busLocation, setBusLocation] = useState<Coordinates | undefined>(
    undefined
  );
  const [estimatedArrival, setEstimatedArrival] = useState<
    Array<{ stop: string; seconds: number }> | undefined
  >(undefined);

  useEffect(() => {
    getRouteData(routeId).then(setRouteData).catch(console.error);

    console.log("Establishing websocket connection to ", webSocketURL);
    const ws = new WebSocket(webSocketURL);
    ws.onmessage = (evt) => {
      const { location, arrival } = JSON.parse(evt.data);
      if (location) {
        setBusLocation(location);
      }
      if (arrival) {
        setEstimatedArrival(arrival);
      }
    };

    return () => ws.close();
  }, [routeId]);

  return routeData ? (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ position: "relative", flexGrow: 1 }}>
        <RouteMap routeData={routeData} busLocation={busLocation} />
      </div>
      {estimatedArrival && estimatedArrival.length > 0 && (
        <ETAPanel estimatedArrival={estimatedArrival} />
      )}
    </div>
  ) : (
    <p style={{ textAlign: "center" }}>Loading...</p>
  );
}

export default BusRoute;
