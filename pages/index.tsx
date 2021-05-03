import { FunctionComponent, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Map from "./map";
import { Route } from "../types/domain/Route";
import { Routes } from "./Routes";
import LatLng from "../types/domain/LatLng";
import { Grid, Box } from "grommet";
import { Circle } from "../types/domain/Circle";
import { Search } from "./search";

interface HomeProps {
  initialMarkerPosition?: LatLng;
}

const Home: FunctionComponent<HomeProps> = ({initialMarkerPosition}) => {
    const [selectedCircle, setSelectedCircle] = useState(null);
    const [routes, setRoutes] = useState(new Array<Route>());

    const onSelectionChange = (circle: Circle): void => {
        setSelectedCircle(circle);
    };

    const onSearchComplete = (routes: Route[]): void => {
        setRoutes(routes);
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Route Finder</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Grid
                fill
                rows={["xsmall", "medium", "xsmall"]}
                columns={["1/3", "2/3"]}
                gap="medium"
                areas={[
                    { name: "header", start: [0, 0], end: [1, 0] },
                    { name: "map", start: [0, 1], end: [0, 1] },
                    { name: "search", start: [0, 2], end: [0, 2] },
                    { name: "routes", start: [1, 1], end: [1, 2] }
                ]}
            >
                <Box direction="row" align="center" gridArea="header" background="light-2" pad="medium">
                    Route Finder
                </Box>

                <Box direction="row" align="center" gridArea="map" background="light-1" pad="medium">
                    <Map onSelectionChange={onSelectionChange} initialMarkerPosition={initialMarkerPosition} />
                </Box>

                <Box direction="row" align="end" gridArea="search" background="light-1" pad="medium">
                    <Search 
                        onSearch={onSearchComplete}
                        circle={selectedCircle}>
                    </Search>
                </Box>
                
                <Box gridArea="routes" background="light-1" pad="medium">
                    <Routes routes={routes} />
                </Box>
            </Grid>

            <footer className={styles.footer}>

            </footer>
        </div>
    );
};

export default Home;