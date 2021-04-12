import { ApolloServer, gql } from 'apollo-server-micro';
import Cors from "micro-cors";
import { makeExecutableSchema } from 'graphql-tools';
import { MongoClient } from 'mongodb';
import RouteDao from "../../models/daos/walk";
import { map, toBinaryId } from "../../models/daos/walkMapper";

const typeDefs = gql`
  type Walk {
    id: String!
    name: String!
    description: String!
    distance: Distance!
    gpx: String!
    centreLocation: LatLong!
    activity: Activity!
    direction: Direction!
    waypoints: [WayPoint]!
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
  }

  type Query {
    walks(filter: WalksFilters): [Walk]!
    walk(id: String!): Walk!
  }
`;

const resolvers = {
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

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

let db;
const apolloServer = new ApolloServer({
  playground: true,
  schema,
  context: async () => {
    if (!db) {
      try {
        const dbClient = new MongoClient(
          process.env.mongo_connection,
          {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          }
        )

        if (!dbClient.isConnected()) await dbClient.connect()
        db = dbClient.db('routes')
      } catch (e) {
        console.log('--->error while connecting with graphql context (db)', e)
      }
    }

    return { db }
  },
})

export const config = {
  api: {
    bodyParser: false,
  },
}

const cors = Cors({
  allowMethods: ["GET", "POST", "OPTIONS"]
});

const handler = apolloServer.createHandler({ path: "/api/graphql" });
export default cors(handler);