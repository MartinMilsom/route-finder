import { ApolloServer } from "apollo-server-micro";
import { makeExecutableSchema } from "graphql-tools";
import { RoutesDatabase } from "./RoutesDatabase";
import { typeDefs, resolvers } from "./schema";

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

console.log("mongo_connection:", process.env.MONGO_CONNECTION);
const routesDb = new RoutesDatabase(process.env.MONGO_CONNECTION);
let db;

const apolloServer = new ApolloServer({
    playground: true,
    schema,
    context: async () => {
        if(!db?.db){
            console.log("connecting...");
            db = await routesDb.connectToDb();
        }
        console.log(db, "database");
        return db;
    }
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default apolloServer.createHandler({ path: "/api/graphql" });