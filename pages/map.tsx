import React, { useCallback, useState, useRef, FunctionComponent } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';
import Route from '../models/Route';
import LatLng from '../models/LatLng';

const containerStyle = {
  width: '500px',
  height: '500px'
};

const Map: FunctionComponent = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
  });

  const circle = useRef(null);
  const [centre, setCentre] = useState({ lat: 52.696361, lng: -2.218373 })
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState<LatLng>(null);
  const [routes, setRoutes] = useState(new Array<Route>());

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
    const req = await fetch(`/api/routes?centreLat=${lat}&centreLng=${lng}&radius=${radius}`);
    const routes: Array<Route> = await req.json();

    return setRoutes(routes);
  };

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
        <ul>
            {routes.map(route => (
              <li>{route.name}</li>
            ))}
        </ul>
      </div>
    </div>
  ) : <></>
}

export default Map;