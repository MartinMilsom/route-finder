import { Fragment, FunctionComponent } from "react";
import { Route } from "../types/domain/Route";
import { Box, Card, CardBody, CardFooter, Button, Text, Grid } from "grommet";
import { Link as LinkIcon } from "grommet-icons";


interface RouteListProps {
    routes: Route[]
  }
  
export const Routes: FunctionComponent<RouteListProps> = ({ routes }) => {
    const heading = routes?.length > 0 ? <h2>Walks</h2>: "";

    console.log(routes)
    return <Fragment>
        {heading}
        <Box fill>
            <Grid
                gap="small"
                pad={{
                    vertical: "large"
                }}
                rows={routes.map(x => "xsmall")}>
            {routes?.map((route, index) => (
                <Card background="light-1">
                    <CardBody pad="small">
                        <Box direction="row">
                            <Box pad={{horizontal: "medium"}}><Text>{route.name}</Text></Box>
                            <Box pad={{horizontal: "medium"}}><Text>{route.direction}</Text></Box>
                            <Box pad={{horizontal: "medium"}}><Text>{route.distance}</Text></Box>
                            <Box pad={{horizontal: "medium"}}><Text>{route.county}</Text></Box>
                        </Box>  
                    </CardBody>
                    <CardFooter pad="xxxsmall" background="light-2">
                        <Button href={route.originalLink} icon={<LinkIcon color="plain" />} hoverIndicator />
                    </CardFooter>
                </Card>
            ))}
            </Grid>
        </Box>
    </Fragment>;
};

export default Routes;
  