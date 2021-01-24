import { Direction } from "readline";
import { Activity } from "./Activity";
import { Distance } from "./Distance";
import { Gpx } from "./Gpx";
import { LatLong } from "./LatLong";
import { Pdf } from "./Pdf";

export class Route {
    name: string;
    distance: Distance;
    gpx: Gpx;
    pdf: Pdf;
    centreLocation: LatLong;
    activity: Activity;
    direction: Direction;
}