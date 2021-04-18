import { ApolloServer, makeExecutableSchema } from "apollo-server-micro";
import { ApolloServerTestClient, createTestClient } from "apollo-server-testing";
import { typeDefs, resolvers } from "../pages/api/schema";

export function testServer<T>(data: T, find: jest.Mock): ApolloServerTestClient {
    find.mockReturnValue({
        toArray: () => Promise.resolve(data)
    });

    const dbContext = {
        db: {
            collection: () => {
                return { find };
            }
        }
    };

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
    });

    return createTestClient(
        new ApolloServer({
            schema,
            context: () => { return dbContext; }
        })
    );
}
