export interface LatLng {
    lat: number;
    lng: number;
  }
  export interface Bounds {
    leftTop: LatLng;
    rightBottom: LatLng;
  }
  export interface Point {
    value: number;
    maxDigit: number;
  }