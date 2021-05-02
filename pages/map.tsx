import React, { useState, useRef, FunctionComponent } from "react";
import { GoogleMap, useJsApiLoader, Circle } from "@react-google-maps/api";
import { Circle as SearchArea} from "../types/domain/Circle";
import LatLng from "../types/domain/LatLng";
import { MapMouseEvent } from "../types/googlemaps/MapMouseEvent";

const containerStyle = {
    width: "100%",
    height: "100%"
};

interface MapProps {
  onSelectionChange: (cirlce: SearchArea) => void;
  initialMarkerPosition?: LatLng;
}

const initialRadius = 8046;

const Map: FunctionComponent<MapProps> = ({initialMarkerPosition, onSelectionChange}) => {
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
        onSelectionChange({lat: lat, lng: lng, radius: initialRadius});
    };

    const onChange = (): void => {
        if(!markerPosition) {
            return;
        }

        const currentCircle = circle?.current?.state?.circle;

        const radius = currentCircle?.radius;
        const lat = currentCircle?.center?.lat();
        const lng = currentCircle?.center?.lng();

        onSelectionChange({lat: lat, lng: lng, radius: radius});
    };

    return isLoaded ? (
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
                    radius={initialRadius}
                    ref={circle}
                    onRadiusChanged={onChange}
                    onCenterChanged={onChange} />
            }
        </GoogleMap>
    ) : <></>;
};

export default Map;