import { Route } from "../types/domain/Route";
import { ApolloClient, gql, NormalizedCacheObject, QueryOptions } from "@apollo/client";
import { WalksQuery } from "./walksQuery";

export class Query {
    client: ApolloClient<NormalizedCacheObject>;
    constructor(client: ApolloClient<NormalizedCacheObject>) {
        this.client = client;
    }

    async walks(query: WalksQuery): Promise<Array<Route>> {
        const { data, error } = await this.client
            .query(mapQuery(query), );

        if(error) {
            console.log("error", error);
            return null;
        }

        console.log("data", data);
        return data.walks;
    }
}

export function mapQuery(query: WalksQuery): QueryOptions {
    const filter: any = {};

    if(query.distance) {
        filter["milesDistance"] = {
            gte: query.distance.greaterThan,
            lte: query.distance.lessThan
        };
    }

    if(query.area) {
        filter["area"] = {
            latitude: query.area.lat,
            longitude: query.area.lng,
            radius: query.area.radius
        };
    }

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
            filter: filter
        },
        errorPolicy: "ignore"
    };
}