import React, { useCallback, useState, useRef, FunctionComponent } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';
import LatLng from '../types/domain/LatLng';
import { Query } from "../queries/WalksQuery";
import { Route } from '../types/domain/Route';

const containerStyle = {
  width: '500px',
  height: '500px'
};

interface MapProps {
  onSelectionChange: Function;
}

const Map: FunctionComponent<MapProps> = ({onSelectionChange}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
  });

  const circle = useRef(null);
  const [centre, setCentre] = useState({ lat: 52.696361, lng: -2.218373 })
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState<LatLng>(null);

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setCentre({ lat: lat, lng: lng })
    setMarkerPosition({ lat, lng });
  }

  const fetchRoutes = async () => {
    if(!markerPosition) {
      return;
    }

    const radius = circle.current.state.circle.radius;
    const lat = circle.current.state.circle.center.lat();
    const lng = circle.current.state.circle.center.lng();
    const routes: Array<Route> = await getRoutes(lat, lng, radius);

    onSelectionChange(routes);
  };

  const getRoutes = async (lat: number, lng: number, radius: number): Promise<Array<Route>> => {
    return await new Query().walksByArea(lat, lng, radius);
  }
  
  const search = async (event) => {
      event.preventDefault();
      await fetchRoutes();
  };

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={centre}
        zoom={6}
        onClick={onMapClick}
        onUnmount={onUnmount}
      >
        {markerPosition &&
          <Circle
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#FF0000",
              fillOpacity: 0.3,
              editable: true
            }}
            center={markerPosition}
            radius={8046}
            ref={circle} />
        }
      </GoogleMap>
      <div>
        <button onClick={search}>Search</button>
      </div>
    </div>
  ) : <></>
}

export default Map;