import { Route } from "../models/Route";
import { Route as DomainRoute } from "../domain/Route";
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
                query GetWalks($area: RadiusFilter!) {
                    walksWithinArea(area: $area) {
                        id,
                        name,
                        county,
                        originalLink
                    }
                }
                `,
            variables: {
                area: {
                    latitude: lat,
                    longitude: lng,
                    radius: radius
                }
            }
            });

        return result.data.walksWithinArea.map(route => this.toRouteModel(route));
    }

    toRouteModel = (route: DomainRoute) => {
        return {
            name: route.name,
            link: route.originalLink
        }
    }
}