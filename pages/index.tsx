import React, { FunctionComponent, useState } from "react";
import Map from "./map";
import { Route } from "../types/domain/Route";
import { Routes } from "./Routes";
import LatLng from "../types/domain/LatLng";
import { Box, Heading, Spinner } from "grommet";
import { Circle } from "../types/domain/Circle";
import { Search } from "./search";
import ResponsiveGrid from "../components/responsiveGrid";
import { Layout } from "../components/layout";

interface HomeProps {
  initialMarkerPosition?: LatLng;
}

const Home: FunctionComponent<HomeProps> = ({ initialMarkerPosition }) => {
  const [searching, setSearching] = useState(false);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [routes, setRoutes] = useState(new Array<Route>());

  const onSelectionChange = (circle: Circle): void => {
    setSelectedCircle(circle);
  };

  const onSearchComplete = (routes: Route[]): void => {
    setRoutes(routes);
    setSearching(false);
  };

  return (
    <Layout>
      <>
        <Box align="center" margin={{ bottom: "none" }}>
          <Heading id="search" margin={{ vertical: "none" }}>
            Hiking Routes
          </Heading>
        </Box>
        <Box pad="xlarge">
          <ResponsiveGrid
            fill
            rows={["medium", "small", "medium", "medium"]}
            columns={["1/4", "1/4", "1/4", "1/4"]}
            areas={{
              large: [
                { name: "map", start: [0, 0], end: [1, 1] },
                { name: "search", start: [2, 0], end: [3, 1] },
                { name: "routes", start: [0, 2], end: [3, 3] },
              ],
              medium: [
                { name: "map", start: [0, 0], end: [1, 1] },
                { name: "search", start: [2, 0], end: [3, 0] },
                { name: "routes", start: [0, 2], end: [3, 3] },
              ],
              small: [
                { name: "map", start: [0, 0], end: [3, 1] },
                { name: "search", start: [0, 2], end: [3, 2] },
                { name: "routes", start: [0, 3], end: [3, 3] },
              ],
            }}
          >
            <Box
              direction="row"
              align="center"
              gridArea="map"
              background="light-1"
              pad="small"
            >
              <Map
                onSelectionChange={onSelectionChange}
                initialMarkerPosition={initialMarkerPosition}
              />
            </Box>

            <Box
              direction="row"
              align="start"
              gridArea="search"
              background="light-1"
              pad="small"
            >
              <Search
                onSearchStarted={() => setSearching(true)}
                onSearchCompleted={onSearchComplete}
                circle={selectedCircle}
              ></Search>
            </Box>

            <Box gridArea="routes" background="light-1" pad="medium">
              {searching ? <Spinner /> : <Routes routes={routes} />}
            </Box>
          </ResponsiveGrid>
        </Box>
      </>
    </Layout>
  );
};

export default Home;
