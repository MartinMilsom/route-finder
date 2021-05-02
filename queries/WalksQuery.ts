export class WalksQuery {
    readonly area?: AreaQuery;
    readonly distance?: DistanceQuery;

    constructor(area?: AreaQuery, distance?: DistanceQuery) {
        this.area = area;
        this.distance = distance;
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