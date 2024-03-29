import Activity from "../domain/Activity";
import Direction from "../domain/Direction";
import { Route } from "../domain/Route";
import RouteDao from "./walk";
import { Binary } from "mongodb";

export const map = (mongoWalk: RouteDao): Route => {
    return {
        id: stringifyId(mongoWalk._id),
        name: mongoWalk.Content.Title,
        description: mongoWalk.Content.Description,
        distance: {
            mile: mongoWalk.Geo?.Gps?.TotalEstimatedDistance?.Miles,
            kilometer: mongoWalk?.Geo?.Gps?.TotalEstimatedDistance?.Kilometers
        },
        centreLocation: {
            latitude: mongoWalk.Geo.Gps.AverageLocation.Lat,
            longitude: mongoWalk.Geo.Gps.AverageLocation.Lon
        },
        county: mongoWalk.Geo.County,
        waypoints: mongoWalk.Geo.Gps.Waypoints.map(x => {
            return {
                name: x.Name,
                coordinates: {
                    latitude: x.Coordinates.Lat,
                    longitude: x.Coordinates.Lon,
                    altitude: x.Coordinates.Alt
                }
            };
        }),
        gpx: mongoWalk.Files.GpxFileLocation,
        activity: Activity.Walk,
        direction: mongoWalk.Geo.Gps.Circular ? Direction.Circular : Direction.PointToPoint,
        originalLink: mongoWalk.OriginalLink
    };
};

export const stringifyId = (id: Binary): string => {
    const buffer = id.buffer;

    return [
        buffer.toString("hex", 0, 4),
        buffer.toString("hex", 4, 6),
        buffer.toString("hex", 6, 8),
        buffer.toString("hex", 8, 10),
        buffer.toString("hex", 10, 16),
    ].join("-");
};

export const toBinaryId = (uuid: string): Binary => {
    const hex = uuid.replace(/[{}-]/g, "");
    const base64Id = Buffer.from(hex, "hex").toString("base64");
    return new Binary(Buffer.from(base64Id, "base64"), 3);
};