import { makeExecutableSchema } from 'graphql-tools';
import { gql } from 'apollo-server-micro';
import RouteDao from '../../types/daos/walk';
import { map, toBinaryId } from "../../types/daos/walkMapper";

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
    Cicular
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
    walks(_parent, _args, _context, _info) {

      var query = {};
      if(_args.filter?.county) {
        query["Geo.County"] = _args.filter.county;
      }

      if(_args.filter?.location) {
        query["Geo.Gps.AverageLocation.Lat"] = _args.filter.location.latitude;
        query["Geo.Gps.AverageLocation.Lon"] = _args.filter.location.longitude;
      }

      if(_args.filter?.milesDistance){
        var distanceQuery = {};
        if(_args.filter?.milesDistance?.gte) {
          distanceQuery["$gte"] = _args.filter.milesDistance.gte;
        }
  
        if(_args.filter?.milesDistance?.lte) {
          distanceQuery["$lte"] = _args.filter.milesDistance.lte
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
        }
      }

      return _context.db
        .collection('newWalks')
        .find(query)
        .toArray()
        .then((data: Array<RouteDao>) => {
          return data.map(x => map(x))
        })
    },

    walk(_parent, _args, _context, _info) {
      return _context.db
        .collection('newWalks')
        .findOne({_id: toBinaryId(_args.id) })
        .then((data: RouteDao) => {
          return map(data)
        })
    }
  },
  Activity: {
    Walk: 0,
    Cycle: 1
  },
  Direction: {
    Cicular: 0,
    PointToPoint: 1
  }
};