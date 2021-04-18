import { FunctionComponent, useState } from "react";
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Map from "./map";
import { Route } from "../types/domain/Route";
import { Routes } from "./Routes";
import LatLng from "../types/domain/LatLng";

interface HomeProps {
  initialMarkerPosition?: LatLng;
}

const Home: FunctionComponent<HomeProps> = ({initialMarkerPosition}) => {
  const [routes, setRoutes] = useState(new Array<Route>());

  const onRoutesChanged = (routes: Route[]) => {
    setRoutes(routes);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Route Finder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Map onSelectionChange={onRoutesChanged} initialMarkerPosition={initialMarkerPosition} />
        <Routes routes={routes} />
      </main>

      <footer className={styles.footer}>

      </footer>
    </div>
  )
}

export default Home;