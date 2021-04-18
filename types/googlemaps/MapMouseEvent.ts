export interface MapMouseEvent {
    latLng: {
        lat: () => number;
        lng: () => number;
    }
  }