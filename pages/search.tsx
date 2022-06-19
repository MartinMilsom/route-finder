import React, { useEffect, FunctionComponent, useState } from "react";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { Query } from "../queries/Query";
import { AreaQuery, DistanceQuery, WalksQuery } from "../queries/WalksQuery";
import { Circle } from "../types/domain/Circle";
import { Route } from "../types/domain/Route";
import { Button, CheckBox, Box, Stack, RangeSelector, Text } from "grommet";
import Direction from "../types/domain/Direction";

type SearchProps = {
  onSearchCompleted: (routes: Route[]) => void;
  onSearchStarted: () => void;
  circle: Circle;
};

const client = new ApolloClient({
  uri: "/api/graphql",
  cache: new InMemoryCache(),
});

export const distanceOptions: Array<number> = [
  0, 1, 3, 5, 7, 10, 15, 25, 50, 100, 200,
];

export const Search: FunctionComponent<SearchProps> = ({
  onSearchStarted,
  onSearchCompleted,
  circle,
}) => {
  const [distanceIndex, setDistanceIndex] = React.useState([1, 5]);
  const [pointToPoint, setPointToPoint] = useState(true);
  const [circular, setCircular] = useState(true);

  const fetchRoutes = async (): Promise<void> => {
    if (!circle) {
      return;
    }

    const routes: Array<Route> = await getRoutes(circle);

    onSearchCompleted(routes);
  };

  const getRoutes = async (circle: Circle): Promise<Array<Route>> => {
    const distance = new DistanceQuery(
      distanceOptions[distanceIndex[0]],
      distanceOptions[distanceIndex[1]]
    );
    let direction: Direction = null;
    if (circular && !pointToPoint) {
      direction = Direction.Circular;
    } else if (!circular && pointToPoint) {
      direction = Direction.PointToPoint;
    }

    return await new Query(client).walks(
      new WalksQuery(
        new AreaQuery(circle.lat, circle.lng, circle.radius),
        distance,
        direction
      )
    );
  };

  const search = async (): Promise<void> => {
    onSearchStarted();
    await fetchRoutes();
  };

  return (
    <div>
      <h2>Filter</h2>
      <Box pad="medium">
        <label id="distanceRangeLabel">
          <Text>Distance (Miles)</Text>
        </label>
        <Stack>
          <Box direction="row" justify="between">
            {distanceOptions.map((value) => (
              <Box key={value} pad="small" basis="xsmall">
                <Text alignSelf="center" style={{ fontFamily: "monospace" }}>
                  {value}
                </Text>
              </Box>
            ))}
          </Box>
          <RangeSelector
            aria-labelledby="distanceRangeLabel"
            direction="horizontal"
            invert={false}
            min={0}
            max={10}
            size="full"
            round="small"
            values={distanceIndex}
            onChange={(values) => setDistanceIndex(values)}
          />
        </Stack>
      </Box>
      <Box pad="medium">
        <label htmlFor="minMiles">
          <Text>Direction</Text>
        </label>
        <Box direction="row" gap="medium">
          <CheckBox
            label="Circular"
            checked={circular}
            onChange={(event) => setCircular(event.target.checked)}
          />
          <CheckBox
            label="Point to point"
            checked={pointToPoint}
            onChange={(event) => setPointToPoint(event.target.checked)}
          />
        </Box>
      </Box>
      <Button
        secondary
        label="Search"
        margin={{ vertical: "large" }}
        alignSelf="center"
        disabled={!circle}
        onClick={search}
      />
    </div>
  );
};

export default Search;
