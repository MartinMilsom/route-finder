/* eslint-disable react/display-name */
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import Home from "../pages/index";
import "@testing-library/jest-dom";
import { distanceOptions } from "../pages/search";
import { Query } from "../queries/Query";
import { Route } from "../types/domain/Route";
import Activity from "../types/domain/Activity";
import Direction from "../types/domain/Direction";
import { MapMouseEvent } from "../types/googlemaps/MapMouseEvent";
jest.mock("@apollo/client");
jest.mock("@react-google-maps/api", () => ({
    GoogleMap: (props: {
        onClick: (e: MapMouseEvent) => void
    }) => <button onClick={() => {
        props.onClick({ 
            latLng: {
                lat: () => 1,
                lng: () => 1,
            }});
    }}>GoogleMap</button>,
    Circle: () => <div />,
    useJsApiLoader: () => ({ isLoaded: true })
}));

it("loads map", async () => {
    // given

    // when
    render(<Home />);
    await waitFor(() => screen.getByText("GoogleMap"));

    // then
    expect(screen.getByText("Search").closest("button")).toHaveAttribute("disabled");
    expect(screen.getByText("GoogleMap")).toBeTruthy();
    expect(screen.queryByText("Walks")).toBeFalsy();
    const distanceRange = screen.getByLabelText("Distance (Miles)");
    expect(distanceRange).toBeInTheDocument();
    
    // 0, 1, 3, 5, 7, 10, 15, 25, 50, 100, 200]
    const expectedStartDistanceMin = 1;
    const expectedStartDistanceMax = 10;
    const minIndex = distanceOptions.findIndex(x => x == expectedStartDistanceMin);
    const maxIndex = distanceOptions.findIndex(x => x == expectedStartDistanceMax);

    const div1 = distanceRange.querySelector("div:nth-child(2) > div");
    expect(div1.getAttribute("role")).toBe("slider");
    expect(div1.getAttribute("aria-valuenow")).toBe(minIndex.toString());

    const ariaNow = (distanceOptions.length - 1) - maxIndex;
    const div2 = distanceRange.querySelector("div:nth-child(4) > div");
    expect(div2.getAttribute("aria-valuenow")).toBe(ariaNow.toString());
    expect(div2.getAttribute("role")).toBe("slider");
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
        direction: Direction.Circular,
        distance: {
            mile: 10,
            kilometer: 16
        },
        gpx: "gpx",
        waypoints: [],
        originalLink: "test-link"
    };
    const walksFn = jest.fn();
    Query.prototype.walks = walksFn.mockReturnValue([expectedRoute]);

    render(<Home initialMarkerPosition={{ lat: 1, lng: 1 }} />);
    await waitFor(() => screen.getByText("GoogleMap").closest("button"));
    screen.getByText("GoogleMap").closest("button").click();

    // when
    screen.getByText("Search").closest("button").click();
    await waitFor(() => screen.getByText("Walks"));

    // then
    expect(screen.getByText("Search").closest("button")).toBeInTheDocument();
    expect(screen.getByText("Search").closest("button")).not.toHaveAttribute("disabled");
    expect(screen.getByText("GoogleMap")).toBeInTheDocument();
    expect(screen.queryByText("Walks")).toBeInTheDocument();
    expect(screen.getByText(expectedRoute.name)).toBeInTheDocument();
    expect(walksFn).toHaveBeenCalledWith({ 
        area: {
            lat: 1,
            lng: 1,
            radius: 8046
        },
        direction: null,
        distance: {
            greaterThan: 1,
            lessThan: 10
        }
    });
});

it("loads search results with direction", async () => {
    // given
    const expectedRoute = {
        name: "test",
        distance: {
            mile: 1
        }
    };
    const walksFn = jest.fn();
    Query.prototype.walks = walksFn.mockReturnValue([expectedRoute]);

    render(<Home initialMarkerPosition={{ lat: 1, lng: 1 }} />);
    await waitFor(() => screen.getByText("GoogleMap").closest("button"));
    screen.getByText("GoogleMap").closest("button").click();

    const pointToPoint = screen.getByLabelText("Point to point");
    fireEvent.click(pointToPoint); // un-select this option

    // when
    screen.getByText("Search").closest("button").click();
    await waitFor(() => screen.getByText("Walks"));

    // then
    expect(screen.getByText("Search").closest("button")).toBeInTheDocument();
    expect(screen.getByText("GoogleMap")).toBeInTheDocument();
    expect(screen.queryByText("Walks")).toBeInTheDocument();
    expect(screen.getByText(expectedRoute.name)).toBeInTheDocument();
    expect(walksFn).toHaveBeenCalledWith({ 
        area: {
            lat: 1,
            lng: 1,
            radius: 8046
        },
        distance: {
            greaterThan: 1,
            lessThan: 10
        },
        direction: Direction.Circular
    });
});