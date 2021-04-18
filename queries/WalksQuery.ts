import { Route } from "../types/domain/Route";
import { ApolloClient, gql, NormalizedCacheObject, QueryOptions } from "@apollo/client";

export class Query {
    client: ApolloClient<NormalizedCacheObject>;
    constructor(client: ApolloClient<NormalizedCacheObject>) {
        this.client = client;
    }

    async walksByArea(lat: number, lng: number, radius: number): Promise<Array<Route>> {
        const result = await this.client
            .query(query(lat, lng, radius));

        return result.data.walks;
    }
}

export function query(lat: number, lng: number, radius: number): QueryOptions {
    return {
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
    };
}