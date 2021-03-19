export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RouteData {
  origin: string;
  destination: string;
  path: Coordinates[];
  initialCenter: Coordinates;
  stops: Coordinates[];
}
