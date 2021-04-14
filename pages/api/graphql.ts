import { ApolloServer, gql } from 'apollo-server-micro';
import { makeExecutableSchema } from 'graphql-tools';
import { MongoClient } from 'mongodb';
import { typeDefs, resolvers } from "./schema";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

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

export default apolloServer.createHandler({ path: "/api/graphql" });