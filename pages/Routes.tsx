import { Fragment, FunctionComponent } from "react";
import { Route } from "../types/domain/Route";


interface RouteListProps {
    routes: Route[]
  }
  
export const Routes: FunctionComponent<RouteListProps> = ({ routes }) => {
    const heading = routes.length > 0 ? <h2>Walks</h2>: "";

    return <Fragment>
        {heading}
        <ul>
            {routes.map((route, index) => (
                <li key={index}><a href={route.originalLink}>{route.name}</a></li>
            ))}
        </ul>
    </Fragment>;
};
  