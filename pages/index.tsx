import React, { FunctionComponent, ReactNode, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Map from "./map";
import { Route } from "../types/domain/Route";
import { Routes } from "./Routes";
import LatLng from "../types/domain/LatLng";
import { Box, Spinner } from "grommet";
import { Circle } from "../types/domain/Circle";
import { Search } from "./search";
import ResponsiveGrid from "../components/responsiveGrid";

interface HomeProps {
  initialMarkerPosition?: LatLng;
}

const Home: FunctionComponent<HomeProps> = ({initialMarkerPosition}) => {
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
        <div className={styles.container}>
            <Head>
                <title>Route Finder</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <ResponsiveGrid
                fill
                rows={["xsmall", "medium", "medium", "medium"]}
                columns={["1/3", "1/3", "1/3"]}
                gap="medium"
                areas={{
                "large": [
                    { name: "header", start: [0, 0], end: [2, 0] },
                    { name: "map", start: [0, 1], end: [0, 1] },
                    { name: "search", start: [1, 1], end: [1, 1] },
                    { name: "routes", start: [2, 1], end: [2, 1] }
                ],
                "medium": [
                    { name: "header", start: [0, 0], end: [2, 0] },
                    { name: "map", start: [0, 1], end: [1, 1] },
                    { name: "search", start: [2, 1], end: [2, 1] },
                    { name: "routes", start: [0, 2], end: [2, 2] }
                ],
                "small": [
                    { name: "header", start: [0, 0], end: [2, 0] },
                    { name: "map", start: [0, 1], end: [2, 1] },
                    { name: "search", start: [0, 2], end: [2, 2] },
                    { name: "routes", start: [0, 3], end: [2, 3] }
                ],
            }}
            >
                <Box direction="row" align="center" gridArea="header" background="light-2" pad="small">
                    <h1>Route Finder</h1>
                </Box>

                <Box direction="row" align="center" gridArea="map" background="light-1" pad="small">
                    <Map onSelectionChange={onSelectionChange} initialMarkerPosition={initialMarkerPosition} />
                </Box>

                <Box direction="row" align="start" gridArea="search" background="light-1" pad="small">
                    <Search
                        onSearchStarted={() => setSearching(true)}
                        onSearchCompleted={onSearchComplete}
                        circle={selectedCircle}>
                    </Search>
                </Box>
                
                <Box gridArea="routes" background="light-1" pad="medium">
                    {searching 
                        ? <Spinner  /> 
                        : <Routes routes={routes} />}
                </Box>
            </ResponsiveGrid>

            <footer className={styles.footer}>

            </footer>
        </div>
    );
};

export default Home;