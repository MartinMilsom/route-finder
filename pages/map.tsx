import React, { useState, useRef, FunctionComponent, ChangeEvent } from "react";
import { GoogleMap, useJsApiLoader, Circle } from "@react-google-maps/api";
import LatLng from "../types/domain/LatLng";
import { Query } from "../queries/Query";
import { Route } from "../types/domain/Route";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { MapMouseEvent } from "../types/googlemaps/MapMouseEvent";
import { AreaQuery, DistanceQuery, WalksQuery } from "../queries/WalksQuery";

const containerStyle = {
    width: "500px",
    height: "500px"
};

const client = new ApolloClient({
    uri: "/api/graphql",
    cache: new InMemoryCache()
});

class MilesRange {
    min: number;
    max: number;
}

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
    const [milesRange, setMilesRange] = useState<MilesRange>(null);

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
        const distance = milesRange ? new DistanceQuery(milesRange.min, milesRange.max) : null;

        return await new Query(client).walks(
            new WalksQuery(
                new AreaQuery(lat, lng, radius),
                distance)
        );
    };
    
    const search = async (): Promise<void> => {
        await fetchRoutes();
    };

    const onMinMilesChanged = (event: ChangeEvent<HTMLInputElement>): void => {
        setMilesRange({ min: parseFloat(event.target.value), max: milesRange?.max });
    };

    const onMaxMilesChanged = (event: ChangeEvent<HTMLInputElement>): void => {
        setMilesRange({ min: milesRange?.min, max: parseFloat(event.target.value) });
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
                <h4>Miles Distance</h4>
                <label htmlFor="minMiles">Min</label>
                <input type="number" id="minMiles" name="minMiles" min="1" max="500" onChange={onMinMilesChanged} />
                <label htmlFor="maxMiles">Max</label>
                <input type="number" id="maxMiles" name="maxMiles" min="1" max="500" onChange={onMaxMilesChanged} />
                {markerPosition &&
                  <button onClick={search}>Search</button>
                }
            </div>
        </div>
    ) : <></>;
};

export default Map;