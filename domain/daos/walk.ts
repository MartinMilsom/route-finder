import { Binary } from "mongodb";

export default class RouteDao {
    _id: Binary;
    Content: ContentDao;
    Images: ImageDao[];
    Files: FilesDao;
    Geo: GeoDao;
    OriginalLink: string;
}

class ContentDao {
    Title: string;
    Description: string;
}

class ImageDao {
    FileLocation: string;
    Caption: string;
}

class FilesDao{
    GpxFileLocation: string;
    MmoFileLocation: string;
}

class GeoDao {
    Country: string;
    County: string;
    Postcode?: string;
    Gps: GpsDao; 
}

class GpsDao {
    Waypoints: WaypointDao[];
    AverageLocation: CoordinatesDao;
    TotalEstimatedDistance: DistanceDao;
    Circular: boolean;
}

class WaypointDao { 
    Name: string;
    Coordinates: CoordinatesDao;
}

class CoordinatesDao {
    Lat: number;
    Lon: number;
    Alt?: number;
}

class DistanceDao {
    Miles: number;
    Kilometers: number;
}