import { FunctionComponent, useState } from "react";
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Map from "./map";
import { Route } from "../types/domain/Route";

export default function Home() {
  const [routes, setRoutes] = useState(new Array<Route>());

  const onRoutesChanged = (routes: Route[]) => {
    setRoutes(routes);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
      <Map onSelectionChange={onRoutesChanged} />
      <RouteList routes={routes} />
      </main>

      <footer className={styles.footer}>

      </footer>
    </div>
  )
}

interface RouteListProps {
  routes: Route[]
}

const RouteList: FunctionComponent<RouteListProps> = ({ routes }) => {
  return <ul>
    {routes.map(route => (
      <li><a href={route.originalLink}>{route.name}</a></li>
    ))}
  </ul>
}
