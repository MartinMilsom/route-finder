import { ApolloServer } from "apollo-server-micro";
import { makeExecutableSchema } from "graphql-tools";
import { Context as DbContext, RoutesDatabase } from "./RoutesDatabase";
import { typeDefs, resolvers } from "./schema";

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

const routesDb = new RoutesDatabase(process.env.MONGO_CONNECTION);
let db: DbContext;

const apolloServer = new ApolloServer({
    playground: true,
    schema,
    context: async () => {
        if(!db?.db){
            console.log("connecting...");
            db = await routesDb.connectToDb();
        }
        return db;
    }
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default apolloServer.createHandler({ path: "/api/graphql" });