import { ApolloServer, gql } from 'apollo-server-micro'
import Cors from "micro-cors";
import { makeExecutableSchema } from 'graphql-tools'
import { MongoClient, ObjectID } from 'mongodb'

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
        .findOne({ "Geo.County": _args.county })
        .then((data) => {
          return [mapWalk(data)]
        })
    },

    walks(_parent, _args, _context, _info) {
      return _context.db
        .collection('newWalks')
        .findOne()
        .then((data) => {
          return [ mapWalk(data) ]
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



function stringify( muuid ){
	const buffer = muuid.buffer

	return [
		buffer.toString('hex', 0, 4),
		buffer.toString('hex', 4, 6),
		buffer.toString('hex', 6, 8),
		buffer.toString('hex', 8, 10),
		buffer.toString('hex', 10, 16),
	].join('-')
}

function mapWalk(mongoWalk) {
  console.log(stringify(mongoWalk._id))
  return {
    id: stringify(mongoWalk._id),
    OriginalLink: mongoWalk.OriginalLink
  }
}