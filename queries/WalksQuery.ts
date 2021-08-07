import Direction from "../types/domain/Direction";

export class WalksQuery {
    readonly area?: AreaQuery;
    readonly distance?: DistanceQuery;
    readonly direction?: Direction;

    constructor(area?: AreaQuery, distance?: DistanceQuery, direction?: Direction) {
        this.area = area;
        this.distance = distance;
        this.direction = direction;
    }
}

export class AreaQuery {
    readonly lat: number;
    readonly lng: number;
    readonly radius: number;

    constructor(lat: number, lng: number, radius: number) {
        this.lat = lat;
        this.lng = lng;
        this.radius = radius;
    }
}

export class DistanceQuery {
    readonly greaterThan?: number;
    readonly lessThan?: number;

    constructor(greaterThan?: number, lessThan?: number) {
        this.greaterThan = greaterThan;
        this.lessThan = lessThan;
    }
}