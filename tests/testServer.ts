import { ApolloServer, makeExecutableSchema } from "apollo-server-micro";
import { createTestClient } from 'apollo-server-testing';
import { typeDefs, resolvers } from "../pages/api/schema";

export async function testServer(data: any, find: jest.Mock<any, any>) {
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
    }
    )
  );
}
