import { ChangeEvent, FunctionComponent, useState } from "react";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { Query } from "../queries/Query";
import { AreaQuery, DistanceQuery, WalksQuery } from "../queries/WalksQuery";
import { Circle } from "../types/domain/Circle";
import { Route } from "../types/domain/Route";

type SearchProps = {
    onSearch: (routes: Route[]) => void;
    circle: Circle;
}

const client = new ApolloClient({
    uri: "/api/graphql",
    cache: new InMemoryCache()
});

class MilesRange {
    min: number;
    max: number;
}

export const Search: FunctionComponent<SearchProps> = ({onSearch, circle}) => {
    const [milesRange, setMilesRange] = useState<MilesRange>(null);

    const fetchRoutes = async (): Promise<void> => {
        if(!circle) {
            return;
        }

        const routes: Array<Route> = await getRoutes(circle);

        onSearch(routes);
    };

    const getRoutes = async (circle: Circle): Promise<Array<Route>> => {
        const distance = milesRange ? new DistanceQuery(milesRange.min, milesRange.max) : null;

        return await new Query(client).walks(
            new WalksQuery(
                new AreaQuery(circle.lat, circle.lng, circle.radius),
                distance)
        );
    };
    
    const search = async (): Promise<void> => {
        await fetchRoutes();
    };

    const onMinMilesChanged = (event: ChangeEvent<HTMLInputElement>): void => {
        setMilesRange({ min: parseFloat(event.target.value), max: milesRange?.max });
    };

    const onMaxMilesChanged = (event: ChangeEvent<HTMLInputElement>): void => {
        setMilesRange({ min: milesRange?.min, max: parseFloat(event.target.value) });
    };

    return (
        <div>
            <h4>Miles Distance</h4>
            <label htmlFor="minMiles">Min</label>
            <input type="number" id="minMiles" name="minMiles" min="1" max="500" onChange={onMinMilesChanged} />
            <label htmlFor="maxMiles">Max</label>
            <input type="number" id="maxMiles" name="maxMiles" min="1" max="500" onChange={onMaxMilesChanged} />
            {circle &&
            <button onClick={search}>Search</button>
            }
        </div>
    );
};