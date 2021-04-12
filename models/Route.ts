import Direction from "./Direction";
import Activity from "./Activity";
import Distance from "./Distance";
import LatLong from "./LatLong";
import { WayPoint } from "./WayPoint";

export default class Route {
    id: string;
    name: string;
    description: string;
    county: string;
    distance: Distance;
    gpx: string;
    centreLocation: LatLong;
    activity: Activity;
    direction: Direction;
    waypoints: Array<WayPoint>
}

