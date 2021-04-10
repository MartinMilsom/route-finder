import { ApolloServer, gql } from 'apollo-server-micro'
import Cors from "micro-cors";
import { makeExecutableSchema } from 'graphql-tools'
import { MongoClient } from 'mongodb'
import RouteDao from "../../models/daos/walk";
import { map } from "../../models/daos/walkMapper";
import { DocumentNode } from 'graphql';

const typeDefs = gql`
  type Walk {
    id: String!
    OriginalLink: String!
  }

  type Query {
    walks: [Walk]!
    walksByCounty(county: String!): [Walk]!
  }
`;


const resolvers = {
  Query: {
    walksByCounty(_parent, _args, _context, _info) {
      return _context.db
        .collection('newWalks')
        .find({ "Geo.County": _args.county })
        .toArray()
        .then((data: Array<RouteDao>) => {
          return data.map(x => map(x))
        })
    },

    walks(_parent, _args, _context, _info) {
      return _context.db
        .collection('newWalks')
        .findOne()
        .then((data: RouteDao) => {
          console.log(data)
          return [ map(data) ]
        })
    }
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
          'mongodb+srv://mm_admin:rL93ANeOeayl7AHFNSB8a@cluster0.bpeys.mongodb.net/routes?retryWrites=true&w=majority',
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