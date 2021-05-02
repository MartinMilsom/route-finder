import { mapQuery } from "../queries/Query";
import { AreaQuery, DistanceQuery, WalksQuery } from "../queries/WalksQuery";
import { toBinaryId } from "../types/daos/walkMapper";
import { testServer } from "./testServer";

const expectedDocument = { "_id": toBinaryId("88be4d2b-a111-6142-b328-aecd3bf6dffa"), Content: { "Title": "Trent Country Park Walks and Cycling", "Description": "This country park on the outskirts of London has 413 acres of rolling meadows, brooks, lakes, ancient woodland, and historical sites to explore on foot or by bike. \nThe wide variety of habitats in the park attracts an abundance of wildlife - look out for Muntjac deer, rabbits and pheasants. In the woodland areas you can see great crested grebe, kingfisher, hobby, treecreeper, nuthatch and great spotted woodpecker while the two large lakes attract geese, swans, mallard ducks and mandarin ducks.\nAlso in the park is the Grade II listed Trent House, surrounded by statues, lime trees, an obelisk, a Japanese water garden, an Orangery and the Camlet Moat. This scheduled Ancient Monument first appeared in local records in 1440.\nTrent Country Park is located in Enfield close to Cockfosters tube station on the Piccadilly Line. The London Loop runs through the park so you could pick up this trail and head to the nearby Whitewebbs Country Park. The park has an ornamental pond, woodland trails,  small lakes and pretty streams to enjoy.", "AdditionalInformation": [{ "Heading": "Trent Country Park Pubs/Cafes", "Description": "The on site Trent Park Cafe is a nice place for some post exercise refreshments. They have a good range of meals and snacks with outdoor seating for finer days. You can find them at the western side of the park near the car park at postcode EN4 0JY." }, { "Heading": "Trent Country Park Dog Walking", "Description": "The woodland and parkland trails are ideal for dog walking so you'll probably see plenty of other owners on a fine day. The cafe mentioned above is also dog friendly with water and snacks available." }, { "Heading": "Further Information and Other Local Ideas", "Description": "The Enfield Walk starts from the nearby town and visits Whitewebbs Park, Forty Hall and the New River Path. It's a nice varied walk with woodland, waterside trails and a visit to a historic hall and gardens.\nFor more walking ideas in the area see the London Walks page." }] }, "Images": [{ "FileLocation": "c:\\code\\gps-routes-scraper-downloads\\Cockfosters,_Trent_Country_Park_-_geograph.org.uk_-_663479.jpg", "Caption": "Cockfosters: Trent Country Park. This is the main Cockfosters Gate entrance to the park off the A111 Cockfosters Road. The building behind the wall is Front Lodge. " }, { "FileLocation": "c:\\code\\gps-routes-scraper-downloads\\Cockfosters,_Trent_Country_Park_-_geograph.org.uk_-_663391.jpg", "Caption": "The park is managed as a public park by the London Borough of Enfield. This is the main driveway, through an avenue of lime trees, from Cockfosters Gate leading to the campus of Middlesex University. " }, { "FileLocation": "c:\\code\\gps-routes-scraper-downloads\\Rabbits_in_Trent_Country_Park,_London,_N14_-_geograph.org.uk_-_316845.jpg", "Caption": "In early evening large numbers of rabbits come out to feed. " }, { "FileLocation": "c:\\code\\gps-routes-scraper-downloads\\Cockfosters,_Trent_Country_Park_-_geograph.org.uk_-_663448.jpg", "Caption": "This small obelisk, with a melon finial, is a monument to Henry, Duke of Kent, and stands at the western end of the park. The inscription on the other side reads:\n\"These Gardens were begun in the Year 1706 AND at Several times Inlarg'd Alter'd and Adorn'd to this Year 1740\". However the obelisk was brought here from Wrest Park by the then owner of the estate, Sir Philip Sassoon, sometime in the early twentieth century, so the inscription does not refer to this location. " }, { "FileLocation": "c:\\code\\gps-routes-scraper-downloads\\Buttercup_Field,_Trent_Country_Park,_London,_N14_-_geograph.org.uk_-_680206.jpg", "Caption": "Looking north through the field of buttercups towards woodland. " }, { "FileLocation": "c:\\code\\gps-routes-scraper-downloads\\Trent_Park_House_with_daffodils_-_geograph.org.uk_-_665658.jpg", "Caption": "Trent Park House with daffodils. View of Middlesex University showing magnificent display of daffodils. " }, { "FileLocation": "c:\\code\\gps-routes-scraper-downloads\\Lake_at_Trent_Country_Park,_London_N14_-_geograph.org.uk_-_710402.jpg", "Caption": "Lake at the park. Another historic image of the Lake at Trent Country Park taken in 1973. This time showing that there used to be a lot more vegetation round the lake compared to how it is today. " }, { "FileLocation": "c:\\code\\gps-routes-scraper-downloads\\Farmland,_Trent_Park,_Enfield_-_geograph.org.uk_-_889368.jpg", "Caption": "Farmland next to the park. Cow sitting in the field adjacent to the Trent Park Equestrian Centre. Was it going to rain I wonder? Another tree that has been struck by lightning is on the right. " }], "Files": { "GpxFileLocation": "c:\\code\\gps-routes-scraper-downloads\\Trent Country Park.gpx", "MmoFileLocation": "c:\\code\\gps-routes-scraper-downloads\\Trent Country Park.mmo" }, "Geo": { "Country": "England", "County": "Greater London", "Postcode": "EN4 0PS", "Gps": { "Waypoints": [{ "Name": "WP5401", "Coordinates": { "Lat": 51.6671352708, "Lon": -0.1360967718, "Alt": 92 } }, { "Name": "WP5423", "Coordinates": { "Lat": 51.6670655784, "Lon": -0.135955027, "Alt": 91 } }], "AverageLocation": { "Lat": 51.661440498395656, "Lon": -0.14008185218695654 }, "loc": { "coordinates": [51.661440498395656, -0.14008185218695654], "type": "Point" } }, "TotalEstimatedDistance": { "Miles": 2.6382709782464304, "Kilometers": 4.245893715896214, "Circular": true } }, "OriginalLink": "http://www.gps-routes.co.uk/routes/home.nsf/RoutesLinksCycle/trent-country-park-walking-and-cycle-route" };

describe("walks query", () => {
    it("returns filtered walk data", async () => {
        // given
        const data = [ expectedDocument ];

        const findQuery: jest.Mock = jest.fn();
        const server = await testServer(data, findQuery);

        const latitude = 50;
        const longitude = -0.1;
        const radius = 100;
        const min = 2;
        const max = 3;

        // when
        const result = await server.query(mapQuery(
            new WalksQuery(
                new AreaQuery(latitude, longitude, radius),
                new DistanceQuery(min, max))));

        // then
        expect(result.data.walks.length).toEqual(1);
        expect(result.data.walks[0]).toEqual({
            id: "88be4d2b-a111-6142-b328-aecd3bf6dffa",
            name: "Trent Country Park Walks and Cycling",
            county: "Greater London",
            originalLink: "http://www.gps-routes.co.uk/routes/home.nsf/RoutesLinksCycle/trent-country-park-walking-and-cycle-route"
        });  
        expect(findQuery).toBeCalledWith({
            "Geo.Gps.AverageLocation.loc": { 
                $near:{ 
                    $geometry :{
                        type: "Point", 
                        coordinates: [latitude, longitude]
                    }, 
                    $maxDistance: radius
                }
            },
            "Geo.Gps.TotalEstimatedDistance.Miles": { 
                $gte: min,
                $lte: max
            }
        });
    });

    it("returns data within a map area", async () => {
        // given
        const data = [ expectedDocument ];

        const findQuery: jest.Mock = jest.fn();
        const server = await testServer(data, findQuery);

        const latitude = 50;
        const longitude = -0.1;
        const radius = 100;

        // when
        const result = await server.query(mapQuery(new WalksQuery(new AreaQuery(latitude, longitude, radius), null)));

        // then
        expect(result.data.walks.length).toEqual(1);
        expect(result.data.walks[0]).toEqual({
            id: "88be4d2b-a111-6142-b328-aecd3bf6dffa",
            name: "Trent Country Park Walks and Cycling",
            county: "Greater London",
            originalLink: "http://www.gps-routes.co.uk/routes/home.nsf/RoutesLinksCycle/trent-country-park-walking-and-cycle-route"
        });  
        expect(findQuery).toBeCalledWith({
            "Geo.Gps.AverageLocation.loc": { 
                $near:{ 
                    $geometry :{
                        type: "Point", 
                        coordinates: [latitude, longitude]
                    }, 
                    $maxDistance: radius
                }
            }
        });
    });

    it("returns data within a range of distances", async () => {
        // given
        const data = [ expectedDocument ];

        const findQuery: jest.Mock = jest.fn();
        const server = await testServer(data, findQuery);

        const min = 2;
        const max = 3;

        // when
        const result = await server.query(mapQuery(new WalksQuery(null, new DistanceQuery(min, max))));

        // then
        expect(result.data.walks.length).toEqual(1);
        expect(result.data.walks[0]).toEqual({
            id: "88be4d2b-a111-6142-b328-aecd3bf6dffa",
            name: "Trent Country Park Walks and Cycling",
            county: "Greater London",
            originalLink: "http://www.gps-routes.co.uk/routes/home.nsf/RoutesLinksCycle/trent-country-park-walking-and-cycle-route"
        });  
        expect(findQuery).toBeCalledWith({
            "Geo.Gps.TotalEstimatedDistance.Miles": { 
                $gte: min,
                $lte: max
            }
        });
    });

    it("returns data greater than distance", async () => {
        // given
        const data = [ expectedDocument ];

        const findQuery: jest.Mock = jest.fn();
        const server = await testServer(data, findQuery);

        const min = 2;

        // when
        const result = await server.query(mapQuery(new WalksQuery(null, new DistanceQuery(min))));

        // then
        expect(result.data.walks.length).toEqual(1);
        expect(result.data.walks[0]).toEqual({
            id: "88be4d2b-a111-6142-b328-aecd3bf6dffa",
            name: "Trent Country Park Walks and Cycling",
            county: "Greater London",
            originalLink: "http://www.gps-routes.co.uk/routes/home.nsf/RoutesLinksCycle/trent-country-park-walking-and-cycle-route"
        });  
        expect(findQuery).toBeCalledWith({
            "Geo.Gps.TotalEstimatedDistance.Miles": { 
                $gte: min
            }
        });
    });

    it("returns data less than distance", async () => {
        // given
        const data = [ expectedDocument ];

        const findQuery: jest.Mock = jest.fn();
        const server = await testServer(data, findQuery);

        const max = 3;

        // when
        const result = await server.query(mapQuery(new WalksQuery(null, new DistanceQuery(null, max))));

        // then
        expect(result.data.walks.length).toEqual(1);
        expect(result.data.walks[0]).toEqual({
            id: "88be4d2b-a111-6142-b328-aecd3bf6dffa",
            name: "Trent Country Park Walks and Cycling",
            county: "Greater London",
            originalLink: "http://www.gps-routes.co.uk/routes/home.nsf/RoutesLinksCycle/trent-country-park-walking-and-cycle-route"
        });  
        expect(findQuery).toBeCalledWith({
            "Geo.Gps.TotalEstimatedDistance.Miles": { 
                $lte: max
            }
        });
    });
});