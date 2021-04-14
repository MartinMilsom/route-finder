import { Route } from "../types/domain/Route";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: '/api/graphql',
  cache: new InMemoryCache()
});

export class Query {
    async walksByArea(lat: number, lng: number, radius: number): Promise<Array<Route>> {
        var result = await client
            .query({
            query: gql`
                query GetWalks($filter: WalksFilters!) {
                    walks(filter: $filter) {
                        id,
                        name,
                        county,
                        originalLink
                    }
                }
                `,
            variables: {
                filter: {
                    area: {
                        latitude: lat,
                        longitude: lng,
                        radius: radius
                    }
                }
            }
            });

        return result.data.walks;
    }
}