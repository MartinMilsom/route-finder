import { ChangeEvent, FunctionComponent, useState } from "react";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { Query } from "../queries/Query";
import { AreaQuery, DistanceQuery, WalksQuery } from "../queries/WalksQuery";
import { Circle } from "../types/domain/Circle";
import { Route } from "../types/domain/Route";
import { RangeInput, Button } from "grommet";

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
    const [milesRange, setMilesRange] = useState<MilesRange>({min: 50, max: 100});

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
        const minMiles = parseFloat(event.target.value);
        const maxMiles = minMiles > milesRange?.max ? minMiles : milesRange?.max;

        setMilesRange({ min: minMiles, max: maxMiles });
    };

    const onMaxMilesChanged = (event: ChangeEvent<HTMLInputElement>): void => {
        const maxMiles = parseFloat(event.target.value);
        const minMiles = maxMiles < milesRange?.min ? maxMiles : milesRange.min;
        setMilesRange({ min: minMiles, max: maxMiles });
    };

    return (
        <div>
            <h2>Filter</h2>
            <label htmlFor="minMiles">Minimum Miles: {milesRange.min}</label>
            <RangeInput
                id="minMiles"
                min={0}
                max={400}
                step={1}
                value={milesRange.min}
                onChange={onMinMilesChanged}
            />
            <label htmlFor="maxMiles">Maximum Miles: {milesRange.max}</label>
            <RangeInput
                id="maxMiles"
                min={0}
                max={400}
                step={1}
                value={milesRange.max}
                onChange={onMaxMilesChanged}
            />
            <Button 
                primary 
                label="Search"
                margin={{vertical: "large"}} 
                alignSelf="center" 
                disabled={!circle}
                onClick={search} />
        </div>
    );
};

export default Search;