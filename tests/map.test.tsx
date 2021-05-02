/* eslint-disable react/display-name */
import { render, waitFor, screen } from "@testing-library/react";
import Home from "../pages/index";
import "@testing-library/jest-dom";
import { Query } from "../queries/Query";
import { Route } from "../types/domain/Route";
import Activity from "../types/domain/Activity";
import Direction from "../types/domain/Direction";
jest.mock("@apollo/client");
jest.mock("@react-google-maps/api", () => ({
    GoogleMap: () => <div>GoogleMap</div>,
    Circle: () => <div />,
    useJsApiLoader: () => ({ isLoaded: true })
}));

it("loads map", async () => {
    // given

    // when
    render(<Home />);
    await waitFor(() => screen.getByText("GoogleMap"));

    // then
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("GoogleMap")).toBeTruthy();
    expect(screen.queryByText("Walks")).toBeFalsy();
});

it("loads search results", async () => {
    // given
    const expectedRoute: Route = {
        id: "123",
        name: "test",
        activity: Activity.Walk,
        centreLocation: {
            latitude:100,
            longitude: 1
        },
        county: "county",
        description: "description",
        direction: Direction.Cicular,
        distance: {
            mile: 10,
            kilometer: 16
        },
        gpx: "gpx",
        waypoints: [],
        originalLink: "test-link"
    };
    Query.prototype.walks = jest.fn().mockReturnValue([expectedRoute]);

    render(<Home initialMarkerPosition={{ lat: 1, lng: 1 }} />);
    await waitFor(() => screen.getByRole("button"));

    // when
    screen.getByRole("button").click();
    await waitFor(() => screen.getByText("Walks"));

    // then
    expect(screen.getByRole("button")).toHaveTextContent("Search");
    expect(screen.getByText("GoogleMap")).toBeInTheDocument();
    expect(screen.queryByText("Walks")).toBeInTheDocument();
    expect(screen.getByText(expectedRoute.name)).toBeInTheDocument();
});