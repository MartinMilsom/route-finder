import { ApolloServer, gql } from 'apollo-server-micro';
import { makeExecutableSchema } from 'graphql-tools';
import { RoutesDatabase } from './RoutesDatabase';
import { typeDefs, resolvers } from "./schema";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const routesDb = new RoutesDatabase(process.env.mongo_connection);
let db;
const apolloServer = new ApolloServer({
  playground: true,
  schema,
  context: async () => {
    if(!db){
      db = await routesDb.connectToDb()
    }
    return db
  }
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apolloServer.createHandler({ path: "/api/graphql" });