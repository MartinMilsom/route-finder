import React, { useState, useRef, FunctionComponent } from "react";
import { GoogleMap, useJsApiLoader, Circle } from "@react-google-maps/api";
import LatLng from "../types/domain/LatLng";
import { Query } from "../queries/WalksQuery";
import { Route } from "../types/domain/Route";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { MapMouseEvent } from "../types/googlemaps/MapMouseEvent";

const containerStyle = {
    width: "500px",
    height: "500px"
};

const client = new ApolloClient({
    uri: "/api/graphql",
    cache: new InMemoryCache()
});

interface MapProps {
  onSelectionChange: (routes: Route[]) => void;
  initialMarkerPosition?: LatLng;
}

const Map: FunctionComponent<MapProps> = ({onSelectionChange, initialMarkerPosition}) => {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    });

    const circle = useRef(null);
    const [centre, setCentre] = useState({ lat: 52.696361, lng: -2.218373 });
    const [markerPosition, setMarkerPosition] = useState<LatLng>(initialMarkerPosition);

    const onMapClick = (e: MapMouseEvent): void => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        setCentre({ lat: lat, lng: lng });
        setMarkerPosition({ lat, lng });
    };

    const fetchRoutes = async (): Promise<void> => {
        if(!markerPosition) {
            return;
        }

        const currentCircle = circle?.current?.state?.circle;

        const radius = currentCircle?.radius;
        const lat = currentCircle?.center?.lat();
        const lng = currentCircle?.center?.lng();
        const routes: Array<Route> = await getRoutes(lat, lng, radius);

        onSelectionChange(routes);
    };

    const getRoutes = async (lat: number, lng: number, radius: number): Promise<Array<Route>> => {
        return await new Query(client).walksByArea(lat, lng, radius);
    };
    
    const search = async (event): Promise<void> => {
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
                {markerPosition &&
                  <button onClick={search}>Search</button>
                }
            </div>
        </div>
    ) : <></>;
};

export default Map;