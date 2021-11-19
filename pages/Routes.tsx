import { Fragment, FunctionComponent } from "react";
import { Route } from "../types/domain/Route";
import { Box, Card, CardBody, CardFooter, Button, Text, Grid } from "grommet";
import { Link as LinkIcon, Contract as ContractIcon, Radial as RadialIcon } from "grommet-icons";
import Direction from "../types/domain/Direction";


interface RouteListProps {
    routes: Route[]
  }
  
export const Routes: FunctionComponent<RouteListProps> = ({ routes }) => {
    const heading = routes?.length > 0 ? <h2>Walks</h2>: "";
    return <Fragment>
        {heading}
        <Box fill>
            <Grid
                gap="small"
                pad={{
                    vertical: "large"
                }}
                rows={routes?.map(() => "xsmall")}>
                {routes?.map((route, index) => (
                    <Card key={index} background="light-1">
                        <CardBody pad="small">
                            <Box direction="row">
                                <Box pad={{horizontal: "medium"}}><Text>{route.name}</Text></Box>
                                <Box pad={{horizontal: "medium"}}>{route.direction == Direction.Circular ? <RadialIcon /> : <ContractIcon />}</Box>
                                <Box pad={{horizontal: "medium"}}><Text>{route.distance.mile.toFixed(0)} miles</Text></Box>
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
  