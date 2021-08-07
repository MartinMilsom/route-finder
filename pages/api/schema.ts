/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql } from "apollo-server-micro";
import { Context } from "./RoutesDatabase";
import RouteDao from "../../types/daos/walk";
import { map, toBinaryId } from "../../types/daos/walkMapper";
import { Route } from "../../types/domain/Route";
import Direction from "../../types/domain/Direction";

export const typeDefs = gql`
  type Walk {
    id: String!
    name: String!
    county: String!
    description: String!
    distance: Distance!
    gpx: String!
    centreLocation: LatLong!
    activity: Activity!
    direction: Direction!
    waypoints: [WayPoint]!
    originalLink: String!
  }

  type Distance {
    kilometer: Float!
    mile: Float!
  }

  type LatLong {
    latitude: Float!
    longitude: Float!
  }

  type WayPoint {
    name: String
    coordinates: LatLonAlt!
  }

  enum Direction {
    Circular
    PointToPoint
  }
  
  enum Activity {
    Walk
    Cycle
  }

  type LatLonAlt {
    latitude: Float!
    longitude: Float!
    altitude: Int!
  }
  
  input LocationFilter {
    latitude: Float!
    longitude: Float!
  }

  input WalksFilters {
    county: String
    location: LocationFilter
    milesDistance: DistanceFilter
    area: RadiusFilter
    direction: Direction
  }

  input DistanceFilter {
    gte: Float
    lte: Float 
  }

  input RadiusFilter {
    radius: Float!
    latitude: Float!
    longitude: Float!
  }

  type Query {
    walks(filter: WalksFilters): [Walk]!
    walk(id: String!): Walk!
  }
`;

export const resolvers = {
    Query: {
        async walks(_parent: any, _args: any, _context: Context): Promise<Array<Route>> {
            const query: any = {};
            if(_args.filter?.county) {
                query["Geo.County"] = _args.filter.county;
            }

            if(_args.filter?.direction) {
                query["Geo.Gps.Circular"] = _args.filter.direction == Direction.Circular;
            }

            if(_args.filter?.location) {
                query["Geo.Gps.AverageLocation.Lat"] = _args.filter.location.latitude;
                query["Geo.Gps.AverageLocation.Lon"] = _args.filter.location.longitude;
            }

            if(_args.filter?.milesDistance){
                const distanceQuery: any = {};
                if(_args.filter?.milesDistance?.gte) {
                    distanceQuery["$gte"] = _args.filter.milesDistance.gte;
                }
          
                if(_args.filter?.milesDistance?.lte) {
                    distanceQuery["$lte"] = _args.filter.milesDistance.lte;
                }

                query["Geo.Gps.TotalEstimatedDistance.Miles"] = distanceQuery;
            }

            if(_args.filter?.area) {
                query["Geo.Gps.AverageLocation.loc"] = { 
                    $near:{ 
                        $geometry :{
                            type: "Point", 
                            coordinates: [_args.filter.area.latitude, _args.filter.area.longitude]
                        }, 
                        $maxDistance: _args.filter.area.radius
                    }
                };
            }
        
            const walks: Array<RouteDao> = await _context.db
                .collection("newWalks")
                .find(query)
                .toArray();

            return walks.map(x => map(x));
        },

        async walk(_parent: any, _args: any, _context: Context): Promise<Route> {
            const walk: RouteDao = await _context.db
                .collection("newWalks")
                .findOne({_id: toBinaryId(_args.id) });
                
            return map(walk);
        }
    }
};