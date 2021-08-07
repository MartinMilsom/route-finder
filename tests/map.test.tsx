/* eslint-disable react/display-name */
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import Home from "../pages/index";
import "@testing-library/jest-dom";
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
    const minimumRange = screen.getByLabelText("Minimum Miles: 50");
    expect(minimumRange).toBeInTheDocument();
    expect(minimumRange.getAttribute("type")).toBe("range");
    expect(minimumRange.getAttribute("min")).toBe("0");
    expect(minimumRange.getAttribute("max")).toBe("400");
    expect(minimumRange.getAttribute("value")).toBe("50");
    const maximumRange = screen.getByLabelText("Maximum Miles: 100");
    expect(maximumRange).toBeInTheDocument();
    expect(maximumRange.getAttribute("type")).toBe("range");
    expect(maximumRange.getAttribute("min")).toBe("0");
    expect(maximumRange.getAttribute("max")).toBe("400");
    expect(maximumRange.getAttribute("value")).toBe("100");
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
            greaterThan: 50,
            lessThan: 100
        }
    });
});

it("loads search results with distance", async () => {
    // given
    const expectedRoute = {
        name: "test",
    };
    const walksFn = jest.fn();
    Query.prototype.walks = walksFn.mockReturnValue([expectedRoute]);

    render(<Home initialMarkerPosition={{ lat: 1, lng: 1 }} />);
    await waitFor(() => screen.getByText("GoogleMap").closest("button"));
    screen.getByText("GoogleMap").closest("button").click();

    const minimumRange = screen.getByLabelText("Minimum Miles: 50");
    fireEvent.change(minimumRange, { target: { value: 1 } });    
    await waitFor(() => screen.getByText("Minimum Miles: 1"));

    const maximumRange = screen.getByLabelText("Maximum Miles: 100");
    fireEvent.change(maximumRange, { target: { value: 5 } });
    await waitFor(() => screen.getByText("Maximum Miles: 5"));

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
            lessThan: 5
        },
        direction: null
    });
});


it("loads search results with direction", async () => {
    // given
    const expectedRoute = {
        name: "test",
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
            greaterThan: 50,
            lessThan: 100
        },
        direction: Direction.Circular
    });
});

it("sets maximum filter if minimum is higher", async () => {
    // given
    const expectedMiles = 150;
    render(<Home initialMarkerPosition={{ lat: 1, lng: 1 }} />);
    const minimumRange = screen.getByLabelText("Minimum Miles: 50");

    // when
    fireEvent.change(minimumRange, { target: { value: expectedMiles } });    
    await waitFor(() => screen.getByText(`Minimum Miles: ${expectedMiles}`));

    // then
    expect(screen.getByLabelText(`Maximum Miles: ${expectedMiles}`)).toBeInTheDocument();
    expect(screen.getByLabelText(`Maximum Miles: ${expectedMiles}`).getAttribute("value")).toBe(expectedMiles.toString());
    expect(screen.getByLabelText(`Minimum Miles: ${expectedMiles}`)).toBeInTheDocument();
    expect(screen.getByLabelText(`Minimum Miles: ${expectedMiles}`).getAttribute("value")).toBe(expectedMiles.toString());
});

it("sets minimum filter if maximum is lower", async () => {
    // given
    const expectedMiles = 20;
    render(<Home initialMarkerPosition={{ lat: 1, lng: 1 }} />);
    const maximumRange = screen.getByLabelText("Maximum Miles: 100");

    // when
    fireEvent.change(maximumRange, { target: { value: expectedMiles } });    
    await waitFor(() => screen.getByText(`Maximum Miles: ${expectedMiles}`));

    // then
    expect(screen.getByLabelText(`Maximum Miles: ${expectedMiles}`)).toBeInTheDocument();
    expect(screen.getByLabelText(`Maximum Miles: ${expectedMiles}`).getAttribute("value")).toBe(expectedMiles.toString());
    expect(screen.getByLabelText(`Minimum Miles: ${expectedMiles}`)).toBeInTheDocument();
    expect(screen.getByLabelText(`Minimum Miles: ${expectedMiles}`).getAttribute("value")).toBe(expectedMiles.toString());
});